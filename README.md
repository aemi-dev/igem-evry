# 2020 iGEM - Evry Paris-Saclay - Project Rosewood's Wiki

This repo is all the code on which [Team Evry Paris-Saclay's Wiki](https://2020.igem.com/Team:Evry_Paris-Saclay) is based.

# How to work on it ?

- Clone or Fork then Clone this repository with : 
```
git clone https://github.com/aemi-dev/igem-evry.git
```
- Then, I recommend you to use [Visual Studio Code](https://code.visualstudio.com/) and install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.

- Then use [mkcert](https://github.com/FiloSottile/mkcert) to create and install locally-trusted development certificates for your local web server. Everything is explained there to set it up.

- [NodeJS](https://nodejs.org/en/) and [npm](https://www.npmjs.com) may be necessary if you want to generate minified and optimized scripts and styles.
    
    - In order to achieve this, install Terser and Clean-CSS and run optimizations:
```
# Install
npm install -g terser clean-css-cli

# Run optimizations
make css js
```

- Then run Live Server, and that's it.

## Results

iGEM Evry Paris-Saclay received a gold medal for their work and 4 nominations.
