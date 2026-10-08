# Testoryx Etech React site

This is a standalone React/Vite rebuild of the published WordPress pages. The
WordPress installation and backup remain outside this app and are not needed at
runtime.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`. Deploy the contents of `dist/`;
configure the static host to serve `index.html` for page routes such as
`/iot-testing/`.

The app includes 27 published Elementor pages, their referenced media and
generated Elementor styles, plus four TablePress datasets. Page content is
static; WordPress admin edits will not automatically update this app.

Contact and career forms validate required fields in the browser only. They do
not send or store submissions.
