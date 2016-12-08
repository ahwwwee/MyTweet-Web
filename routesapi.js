const TweetsApi = require('./app/api/tweetsapi');
const UsersApi = require('./app/api/usersapi');

module.exports = [

    { method: 'GET', path: '/api/tweets', config: TweetsApi.findAll },
    { method: 'GET', path: '/api/tweets/{email}', config: TweetsApi.findOne },
    { method: 'POST', path: '/api/users/{id}/tweets', config: TweetsApi.create },
    { method: 'DELETE', path: '/api/tweets/{id}', config: TweetsApi.deleteSome },
    { method: 'DELETE', path: '/api/tweets', config: TweetsApi.deleteAll },
    { method: 'DELETE', path: '/api/users/{id}/tweets', config: TweetsApi.deleteUserTweets },
    { method: 'POST', path: '/api/update/{id}', config: TweetsApi.update },

    { method: 'GET', path: '/api/users', config: UsersApi.findAll },
    { method: 'GET', path: '/api/users/{id}', config: UsersApi.findOne },
    { method: 'POST', path: '/api/users', config: UsersApi.createUser },
    { method: 'DELETE', path: '/api/users', config: UsersApi.deleteAll },
    { method: 'DELETE', path: '/api/users/{id}', config: UsersApi.deleteOne },
    { method: 'POST', path: '/api/users/{id}/follow', config: UsersApi.follow },
    { method: 'GET', path: '/api/users/{id}/following', config: UsersApi.getFollowingTweets },
    { method: 'POST', path: '/api/users/authenticate', config: UsersApi.authenticate },

];
