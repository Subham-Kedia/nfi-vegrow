# Build docker image
FROM node:18.12.0 as build-frontend
# Make the 'app' folder the current working directory
WORKDIR /app
# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY package.json .
# Create the .ssh directory with the appropriate permissions and add GitHub's SSH key to known_hosts
RUN mkdir -p -m 0700 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts
# install project dependencies
RUN --mount=type=ssh id=github \
    yarn
# copy project files and folders   
COPY . .
# setting APP_ENV for production build
ARG APP_ENV=production
ENV APP_ENV=$APP_ENV
# build app for production with minification
RUN yarn build:prod
# Copy the react app build above in nginx
FROM nginx:alpine
# copy dist for build-frontend to nginx
COPY --from=build-frontend /app/dist /usr/share/nginx/html
# export port
EXPOSE 80
# copy nginx conf file
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
# Containers run nginx with global directives and daemon off
CMD ["nginx", "-g", "daemon off;"]