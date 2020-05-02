FROM cypress/included:4.5.0

# # "root"
# RUN whoami

# # there is a built-in user "node" that comes from the very base Docker Node image
# # move test runner binary folder to the non-root's user home directory
# RUN mv /root/.cache /home/node/.cache

# # USER node

WORKDIR /user/app
COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn

RUN ls
RUN yarn cypress install

COPY . .

ENV CYPRESS_BASE_URL=http://host.docker.internal:3000
ENV CYPRESS_VIDEO=false
# ENTRYPOINT [ "node" ]
CMD ["npm", "run", "e2e"]