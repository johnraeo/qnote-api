# Q Note - API

This application is a basic CRUD (Create, Read, Update, Delete) operations app with authentication functionality. It allows users to register, login, add and manage notes. 

## Installation

1. Create a MongoDB database and obtain your `MongoDB URI` - [MongoDB Atlas]
2. Git clone/download this repository
3. Create a file `.env` from root folder, paste(code below) and modify `DATABASE_URI`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`

(similar to this)
```
NODE_ENV=development
DATABASE_URI=mongodb+srv://mongotut:yourpassword@cluster0.testonl.mongodb.net/?retryWrites=true&w=majority&appName=TestCluster
ACCESS_TOKEN_SECRET=youraccesstoken
REFRESH_TOKEN_SECRET=yourrefreshtoken
```
4.  install dependencies and run
```
npm install
npm run dev
```

Access app on `localhost:3500`

* Frontend here - [Q-Note](https://github.com/johnraeo/qnote)

## Credits

- **[MERN Stack Full Tutorial & Project | Complete All-in-One Course | 8 Hours](https://www.youtube.com/watch?v=CvCiNeLnZ00)**
  - *Creator:* Dave Gray
  - *Published:* September 27, 2022
  - *Description:* A full MERN Stack tutorial inspired by the work of [Dave Gray](https://github.com/gitdagray) from his [MERN tutorial](https://www.youtube.com/watch?v=CvCiNeLnZ00&t=4035s).