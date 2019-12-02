// 文本分行
function printAtWordWrap(context, text, x, y, lineHeight, fitWidth) {
  fitWidth = fitWidth || 0;
  if (fitWidth <= 0) {
    context.fillText(text, x, y);
    return;
  }
  let words = text.split('');
  let currentLine = 0;
  let idx = 1;
  while (words.length > 0 && idx <= words.length) {
    const str = words.slice(0, idx).join('');
    const w = context.measureText(str).width;
    if (w > fitWidth) {
      if (idx == 1) {
        idx = 2;
      }
      context.fillText(words.slice(0, idx - 1).join(''), x, y + (lineHeight * (currentLine + 0.5)));
      currentLine++;
      words = words.splice(idx - 1);
      idx = 1;
    } else {
      idx++;
    }
  }
  if (idx > 0)
    context.fillText(words.join(''), x, y + (lineHeight * (currentLine + 0.5)));
}

function loadImage (url) {
	return new Promise((resolve, reject) => {
		resolve(url)
	})
}



// 绘制函数
exports.drawjs = (ctx, drawData) => {
  return new Promise((resolve, reject) => {
    const {
      imgs,
      fonts,
      global
    } = drawData
    let len = imgs.length + fonts.length
    let n = 0
    if (global.url) {
      loadImage(global.url)
        .then(img => {
          ctx.save()
          ctx.drawImage(img, 0, 0, global.width, global.height)
          ctx.restore()
          drawText()
          drawImg()
        })
    } else {
      drawText()
      drawImg()
    }

    // 绘制图片
    function drawImg () {
      imgs.forEach((item) => {
        loadImage(item.url)
          .then(img => {
            ctx.save()
            ctx.translate(item.left+item.width / 2, item.top+item.height / 2)
            ctx.rotate(item.angle * Math.PI / 180)
            ctx.scale(item.scale, item.scale)
            ctx.translate(-item.width / 2, -item.height / 2)
            ctx.drawImage(img, 0, 0, item.width, item.height)
            ctx.restore()
            if (n === len - 1) {
              resolve(ctx)
            } else {
              n++
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    }

    // 绘制文本
    function drawText () {
      fonts.forEach((item) => {
        ctx.save()
        ctx.font = `${item.fontSize || 14}px ${item.fontFamily || 'Roboto Mono'}`
        ctx.fillStyle = `${item.fillStyle || item.color || '#333333'}`
		ctx.textBaseline = 'middle'
        printAtWordWrap(ctx, item.text, item.left, item.top, item.lineHeight, item.width)
        ctx.restore()
        if (n === len - 1) {
          resolve(ctx)
        } else {
          n++
        }
      })
    }
  })
}
