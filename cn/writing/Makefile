md2html:
	test -n "$(i)"
	pandoc "$(i)" --to html --css style.css --self-contained | python3.8 -m premailer | node -e "cheerio = require('cheerio'); doc = cheerio.load(fs.readFileSync('/dev/stdin'));doc('*').attr('copyright','公众号：碳结 构（carbonstruct）');console.log(doc.html())" | xclip -selection clip_board -t text/html
	# 参考https://stackoverflow.com/questions/3261379/getting-html-source-or-rich-text-from-the-x-clipboard
	# 参考https://stackoverflow.com/questions/54816884/inline-css-with-pandoc
import:
	test -n "$(i)"
	git checkout --patch master "$(i)"
images:
	grep -o -h -P '(?<=^!\[\]\().+?(?=\))' *.md | xargs -n1 git checkout master
sync:
	find -maxdepth 1 -type f -name '*.md' | xargs -n1 git checkout master