# Collectify

Collectify is a website designed for creating, storing, and displaying collections of items. The client side is built with JavaScript using the React library, while the server side is also implemented in JavaScript, utilizing the Express.js framework. For search functionality, I integrated ElasticSearch, and MySQL database for data data storing.
This repo contain a client side code.

> Main page.

<img width="750" alt="collectify-main-page" src="https://asset.cloudinary.com/daz6gyr7k/aa7c806a90df27f6036a1165e9429d6b">

Key Features:

1. User Registration and Login: Users can create an account and log in to access the platform's features.
2. Create a collection: Registered users can create collections of items. Each collection has a header image, a theme, and a list of items.
3. Creating Items: The user can add items to his collection. Each item has a name, description and tags.
4. Likes and comments: Any registered user can comment on items and like them. New comments and likes are added in real time.
5. Search by collections and items: Any user can use the search by collections, items and comments. The search result is a list of everything that contains the searched word.
6. Tag cloud: The main page of the site contains a tag cloud for quickly searching for items using popular tags

## Technologies used

- **[Node.js](https://nodejs.org/en/)** - As an asynchronous event-driven JavaScript runtime, Node.js is designed to build scalable network applications.
- **[React](https://react.dev/)** - The library for web and native user interfaces.
- And other requirements which are in the package.json file.

## Local development

The project comes with a basic configuration for local start.

> Get the code

```bash
git clone https://github.com/chkvdm/collectify-app-frontend
cd collectify-app-frontend
```

> Install all package and requiremets.

```bash
npm install
```

> Start the app

```bash
npm start
```

## License

[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](https://opensource.org/licenses/MIT)
