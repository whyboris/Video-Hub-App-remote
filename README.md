# Video Hub App Remote

This is the "Remote" for [Video Hub App](https://videohubapp.com/) (see [GitHub](https://github.com/whyboris/Video-Hub-App/)).

It lets you browse videos showing in _Video Hub App_ and make the app play videos on your computer by using your phone or tablet (when both are connected to the same WiFi).

![remote](https://user-images.githubusercontent.com/17264277/102023470-72f5e280-3d5a-11eb-8307-1f51d7210aee.png)

### Developing

This is an *Angular* project.

- `npm install` to install
- `npm start` to develop
- `npm run build` to build

You may need to [allow CORS](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf).

_Video Hub App_ will start a _socket server_ and all communication between it and the _Remote_ will happen with messages sent over the web socket connection.

In _Chrome Developer Tools_ click _Toggle device toolbar_ to interact using "touch events" (not mouse clicks).

The assets built with this repository are meant to be added into _Video Hub App_ before compiling.

### Thank you

Thank you to [Feather](https://feathericons.com/) for icons.
