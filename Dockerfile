FROM node:6.7-wheezy

# RUN wget https://yarnpkg.com/latest.tar.gz -O /opt/
# RUN mv /opt/dist /opt/yarn
# ENV PATH "$PATH:/opt/yarn/bin"
# RUN apt-get update
# RUN apt-get install -y yarn

# RUN npm install -g --progress=false yarn

ENV HOME=/home/nodejs
ENV NODE_ENV=production

RUN useradd --user-group --create-home --shell /bin/false nodejs
RUN npm install -g yarn

COPY ./ $HOME/app/
RUN chown -R nodejs:nodejs $HOME/*
USER nodejs
ENV PATH $PATH:$HOME/node_modules/.bin

WORKDIR $HOME/app

RUN yarn install

CMD ["node", "server.js"]
