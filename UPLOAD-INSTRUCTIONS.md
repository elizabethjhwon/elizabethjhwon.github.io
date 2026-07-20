# Publish the continuous dark-blue update

From inside your existing website repository, run:

```bash
cd ~/Downloads
unzip -o elizabeth-night-sky-full-blue-final.zip
cd -
cp -R ~/Downloads/elizabeth-night-sky-full-blue/. .
git add .
git commit -m "Extend night sky across the full site"
git push origin main
```
