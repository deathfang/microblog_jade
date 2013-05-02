htmlText = function(a,b) {
    function isTextNode(a) {
        return a.nodeType == 3 || a.nodeType == 4
    }
    function isElementNode(a) {
        return a.nodeType == 1
    }
    function isBrNode(a) {
        return isElementNode(a) && a.nodeName.toLowerCase() == "br"
    }
    var MAX_OFFSET = Number.MAX_VALUE

    function isOutsideContainer(a, b) {
        while (a !== b) {
            if (!a) return !0;
            a = a.parentNode
        }
    }
    var NBSP_REGEX = /[\xa0\n\t]/g,
        CRLF_REGEX = /\r\n/g,
        LINES_REGEX = /(.*?)\n/g,
        SP_LEADING_OR_FOLLOWING_CLOSE_TAG_OR_PRECEDING_A_SP_REGEX = /^ |(<\/[^>]+>) | (?= )/g,
        SP_LEADING_OR_TRAILING_OR_FOLLOWING_A_SP_REGEX = /^ | $|( ) /g,
        MAX_OFFSET = Number.MAX_VALUE
    function c(a, c) {
        function h(a) {
            var i = d.length;
            if (isTextNode(a)) {
                var j = a.nodeValue.replace(NBSP_REGEX, " "),
                    k = j.length;
                k && (d += j, e = !0), c(a, !0, 0, i, i + k)
            } else if (isElementNode(a)) {
                c(a, !1, 0, i, i);
                if (isBrNode(a)) a == f ? g = !0 : (d += "\n", e = !1);
                else {
                    var l = a.currentStyle || window.getComputedStyle(a, ""),
                        m = l.display == "block";
                    m && b.ie && (e = !0);
                    for (var n = a.firstChild, o = 1; n; n = n.nextSibling, o++) {
                        h(n);
                        if (g) return;
                        i = d.length, c(a, !1, o, i, i)
                    }
                    g || a == f ? g = !0 : m && e && (d += "\n", e = !1)
                }
            }
        }
        var d = "",
            e, f, g;
        for (var i = a; i && isElementNode(i); i = i.lastChild) f = i;
        return h(a), d
    }
		function d(a, b) {
			var d = null,
				e = b.length - 1;
				var f = b.map(function() {
					return {}
				}),
					g;
				c(a, function(a, c, d, h, i) {
					g || f.forEach(function(f, j) {
						var k = b[j];
						h <= k && !isBrNode(a) && (f.node = a, f.offset = c ? Math.min(k, i) - h : d, g = c && j == e && i >= k)
					})
				}), f[0].node && f[e].node && (d = document.createRange(), d.setStart(f[0].node, f[0].offset), d.setEnd(f[e].node, f[e].offset))
			return d
		}
		function e() {
			return a.offsetWidth && a.offsetHeight
		}

		function g(a, b) {
			return a.map(function(a) {
				return Math.min(a, b.length)
			})
		}

		function h() {
			var b = getSelection();
			if (b.rangeCount !== 1) return null;
			var d = b.getRangeAt(0);
			if (isOutsideContainer(d.commonAncestorContainer, a)) return null;
			var e = [{
				node: d.startContainer,
				offset: d.startOffset
			}];
			d.collapsed || e.push({
				node: d.endContainer,
				offset: d.endOffset
			});
			var f = e.map(function() {
				return MAX_OFFSET
			}),
				h = c(a, function(a, b, c, d) {
					e.forEach(function(e, g) {
						f[g] == MAX_OFFSET && a == e.node && (b || c == e.offset) && (f[g] = d + (b ? e.offset : 0))
					})
				});
			return g(f, h)
		}
	return {
		getSelectionOffsets: function() {
				var a = null;
				return e() && ( a = h()), a
		},
		setSelectionOffsets: function(b) {
			if (b && e()) {
				var c = d(a, b);
				if (c) 
					var f = window.getSelection();
					f.removeAllRanges(), f.addRange(c)
				
			}
		}		
	}
	
}