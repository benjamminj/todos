FROM cypress/base:12.16.1

WORKDIR /user/app
COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn

RUN ls
RUN yarn cypress install

COPY . .

RUN yarn build 

# TODO: this should be "dynamic" or point to an app running explicitly in the container.
ENV CYPRESS_BASE_URL=http://localhost:3000
ENV CYPRESS_VIDEO=false

CMD ["npm", "run", "e2e"]