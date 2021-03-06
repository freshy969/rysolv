/* eslint-disable camelcase */
const fetch = require('node-fetch');

const { authenticate } = require('./auth');
const { CustomError } = require('../helpers');

const getGithubIssueComments = async ({ issueNumber, organization, repo }) => {
  try {
    // Authenticate with oktokit API - @TODO: create better auth middleware
    const { GITHUB } = await authenticate();

    const { data } = await GITHUB.issues.listComments({
      issue_number: issueNumber,
      owner: organization,
      repo,
    });
    const githubComments = data.map(
      ({ body, created_at, user: { avatar_url, html_url, id, login } }) => ({
        body,
        createdDate: new Date(created_at),
        githubUrl: html_url,
        isGithubComment: true,
        profilePic: avatar_url,
        userId: id,
        username: login,
      }),
    );
    return githubComments;
  } catch (error) {
    return [];
  }
};

const getSingleIssue = async ({ issueNumber, organization, repo }) => {
  try {
    // Authenticate with oktokit API - @TODO: create better auth middleware
    const { GITHUB } = await authenticate();

    const { data: issueData } = await GITHUB.issues.get({
      issue_number: issueNumber,
      owner: organization,
      repo,
    });

    const {
      body,
      comments,
      html_url,
      pull_request,
      repository_url,
      state,
      title,
    } = issueData;

    if (!html_url)
      throw new CustomError(`We are unable to import this issue from ${repo}.`);
    if (pull_request)
      throw new CustomError(
        `This issue is addressed by an existing pull request.`,
      );
    if (state !== 'open')
      throw new CustomError(`Closed issue cannot be added.`);

    const issueInput = {
      githubCommentCount: comments,
      issueBody: body, // Required
      issueName: title, // Required
      issueUrl: html_url, // Required
      organizationUrl: repository_url, // Required
    };
    return { issueInput };
  } catch (error) {
    throw error;
  }
};

const getSingleOrganization = async organization => {
  // Authenticate with oktokit API - @TODO: create better auth middleware
  const { GITHUB } = await authenticate();

  const { data: organizationData } = await GITHUB.orgs.get({
    org: organization,
  });

  const {
    avatar_url,
    bio,
    blog,
    html_url,
    login,
    name,
    type,
  } = organizationData;

  if (!html_url)
    throw new CustomError(
      `We are unable to import this organization from ${organization}.`,
    );
  if (type === 'User')
    throw new CustomError(
      `User account cannot be imported as an organization.`,
    );

  const organizationInput = {
    organizationDescription: bio || '', // Optional
    organizationLanguages: [], // Optional
    organizationLogo: avatar_url, // Required
    organizationName: name || login, // Preferred name or login name
    organizationRepo: html_url, // Required
    organizationUrl: blog || '', // Optional
  };
  return { organizationInput };
};

const getSinglePullRequest = async ({ organization, pullNumber, repo }) => {
  // Authenticate with oktokit API - @TODO: create better auth middleware
  const { GITHUB } = await authenticate();

  const { data: pullRequestData } = await GITHUB.pulls.get({
    owner: organization,
    pull_number: pullNumber,
    repo,
  });

  const {
    html_url,
    mergeable_state,
    mergeable,
    merged,
    number,
    state,
    title,
    user: { id, login },
  } = pullRequestData;

  if (state !== 'open')
    throw new CustomError(`This pull request has been closed.`);
  if (merged)
    throw new CustomError(`This pull request has already been merged.`);

  const isMergeable = mergeable === null ? false : mergeable;
  const isMerged = merged === null ? false : merged;
  const pullData = {
    githubId: id,
    githubUsername: login,
    htmlUrl: html_url,
    mergeable: isMergeable,
    mergeableState: mergeable_state,
    merged: isMerged,
    open: state === 'open',
    pullNumber: number,
    title,
  };
  return pullData;
};

const getSingleRepo = async ({ organization, repo }) => {
  try {
    // Authenticate with oktokit API - TODO: create better auth middleware
    const { GITHUB } = await authenticate();

    const { data: repoData } = await GITHUB.repos.get({
      owner: organization,
      repo,
    });

    const {
      description,
      homepage,
      html_url,
      language,
      name,
      organization: parentOrganization,
    } = repoData;

    if (!html_url)
      throw new CustomError(`We are unable to import this organization.`);

    const organizationInput = {
      issueLanguages: language ? [language] : [], // Optional - one entry
      organizationDescription: description || '', // Optional
      organizationLanguages: language ? [language] : [], // Optional - one entry
      organizationName: name, // Required
      organizationRepo: html_url, // Required
      organizationUrl: homepage || '', // Optional
    };

    if (parentOrganization) {
      const { data: parentData } = await GITHUB.orgs.get({
        org: parentOrganization.login,
      });

      const {
        avatar_url,
        bio,
        blog,
        html_url: parentRepo,
        login,
        name: parentName,
      } = parentData;

      organizationInput.organizationLogo = avatar_url; // Required
      organizationInput.organizationName = parentName || login; // Preferred name or login name
      organizationInput.organizationRepo = parentRepo; // Required
      organizationInput.organizationUrl = blog || ''; // Optional
      // Only replace repo bio if parent bio exists
      if (bio) organizationInput.organizationDescription = bio;
    }

    return { organizationInput };
  } catch (error) {
    throw error;
  }
};

const getUserGithubIssues = async ({ username }) => {
  const { GITHUB } = await authenticate();

  const { data: repos } = await GITHUB.repos.listForUser({
    username,
  });

  const issues = [];

  await Promise.all(
    repos.map(async repo => {
      const { data } = await GITHUB.issues.listForRepo({
        owner: username,
        repo: repo.name,
        sort: 'created',
        state: 'open',
      });
      data.forEach(({ html_url, pull_request, title, updated_at, user }) => {
        if (!pull_request && user.type !== 'Bot') {
          issues.push({
            createdDate: updated_at,
            name: title,
            organizationName: repo.name,
            repo: html_url,
          });
        }
      });
    }),
  );

  return issues;
};

const getUserGithubRepos = async ({ username }) => {
  const { GITHUB } = await authenticate();

  const { data } = await GITHUB.repos.listForUser({
    sort: 'updated',
    type: 'all',
    username,
  });

  return data.map(({ html_url, name, updated_at }) => ({
    modifiedDate: updated_at,
    name,
    organizationUrl: html_url,
  }));
};

const requestGithubToken = credentials =>
  fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(credentials),
  })
    .then(res => res.json())
    .catch(error => {
      throw new Error(JSON.stringify(error));
    });

const requestGithubUserAccount = token =>
  fetch(`https://api.github.com/user`, {
    headers: { Authorization: `token ${token}` },
  }).then(res => res.json());

const requestGithubUserEmail = token =>
  fetch(`https://api.github.com/user/emails`, {
    headers: { Authorization: `token ${token}` },
  }).then(res => res.json());

const requestGithubUser = async credentials => {
  const { access_token } = await requestGithubToken(credentials);
  const { email, html_url, id, login, name } = await requestGithubUserAccount(
    access_token,
  );
  const emailList = await requestGithubUserEmail(access_token);
  const emailArray = Array.isArray(emailList) ? emailList : [];
  const [{ email: secondaryEmail }] = emailArray.filter(
    ({ primary }) => primary === true,
  );
  const fullName = name || '';
  const nameArray = fullName.split(' ');
  const first_name = nameArray[0];
  const last_name = nameArray[1];
  return {
    email: email || secondaryEmail,
    first_name: first_name || '',
    github_id: id,
    github_link: html_url,
    github_username: login,
    last_name: last_name || '',
  };
};

module.exports = {
  getGithubIssueComments,
  getSingleIssue,
  getSingleOrganization,
  getSinglePullRequest,
  getSingleRepo,
  getUserGithubIssues,
  getUserGithubRepos,
  requestGithubUser,
};
