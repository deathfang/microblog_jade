//modified line 130
!function() {
    var b = {};
    (function() {
        function c(a, c) {
            return c = c || "", typeof a != "string" && (a.global && c.indexOf("g") < 0 && (c += "g"), a.ignoreCase && c.indexOf("i") < 0 && (c += "i"), a.multiline && c.indexOf("m") < 0 && (c += "m"), a = a.source), new RegExp(a.replace(/#\{(\w+)\}/g, function(a, c) {
                var d = b.txt.regexen[c] || "";
                return typeof d != "string" && (d = d.source), d
            }), c)
        }
        function d(a, b) {
            return a.replace(/#\{(\w+)\}/g, function(a, c) {
                return b[c] || ""
            })
        }
        function e(a, b, c) {
            var d = String.fromCharCode(b);
            return c !== b && (d += "-" + String.fromCharCode(c)), a.push(d), a
        }
        function q(a) {
            var b = {};
            for (var c in a) a.hasOwnProperty(c) && (b[c] = a[c]);
            return b
        }
        function u(a, b, c) {
            return c ? !a || a.match(b) && RegExp["$&"] === a : typeof a == "string" && a.match(b) && RegExp["$&"] === a
        }
        b.txt = {}, b.txt.regexen = {};
        var a = {
            "&": "&amp;",
            ">": "&gt;",
            "<": "&lt;",
            '"': "&quot;",
            "'": "&#39;"
        };
        b.txt.htmlEscape = function(b) {
            return b && b.replace(/[&"'><]/g, function(b) {
                return a[b]
            })
        }, b.txt.regexSupplant = c, b.txt.stringSupplant = d, b.txt.addCharsToCharClass = e;
        var f = String.fromCharCode,
            g = [f(32), f(133), f(160), f(5760), f(6158), f(8232), f(8233), f(8239), f(8287), f(12288)];
        e(g, 9, 13), e(g, 8192, 8202);
        var h = [f(65534), f(65279), f(65535)];
        e(h, 8234, 8238), b.txt.regexen.spaces_group = c(g.join("")), b.txt.regexen.spaces = c("[" + g.join("") + "]"), b.txt.regexen.invalid_chars_group = c(h.join("")), b.txt.regexen.punct = /\!'#%&'\(\)*\+,\\\-\.\/:;<=>\?@\[\]\^_{|}~\$/, b.txt.regexen.rtl_chars = /[\u0600-\u06FF]|[\u0750-\u077F]|[\u0590-\u05FF]|[\uFE70-\uFEFF]/gm, b.txt.regexen.non_bmp_code_pairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/gm;
        var i = [];
        e(i, 1024, 1279), e(i, 1280, 1319), e(i, 11744, 11775), e(i, 42560, 42655), e(i, 1425, 1471), e(i, 1473, 1474), e(i, 1476, 1477), e(i, 1479, 1479), e(i, 1488, 1514), e(i, 1520, 1524), e(i, 64274, 64296), e(i, 64298, 64310), e(i, 64312, 64316), e(i, 64318, 64318), e(i, 64320, 64321), e(i, 64323, 64324), e(i, 64326, 64335), e(i, 1552, 1562), e(i, 1568, 1631), e(i, 1646, 1747), e(i, 1749, 1756), e(i, 1758, 1768), e(i, 1770, 1775), e(i, 1786, 1788), e(i, 1791, 1791), e(i, 1872, 1919), e(i, 2208, 2208), e(i, 2210, 2220), e(i, 2276, 2302), e(i, 64336, 64433), e(i, 64467, 64829), e(i, 64848, 64911), e(i, 64914, 64967), e(i, 65008, 65019), e(i, 65136, 65140), e(i, 65142, 65276), e(i, 8204, 8204), e(i, 3585, 3642), e(i, 3648, 3662), e(i, 4352, 4607), e(i, 12592, 12677), e(i, 43360, 43391), e(i, 44032, 55215), e(i, 55216, 55295), e(i, 65441, 65500), e(i, 12449, 12538), e(i, 12540, 12542), e(i, 65382, 65439), e(i, 65392, 65392), e(i, 65296, 65305), e(i, 65313, 65338), e(i, 65345, 65370), e(i, 12353, 12438), e(i, 12441, 12446), e(i, 13312, 19903), e(i, 19968, 40959), e(i, 173824, 177983), e(i, 177984, 178207), e(i, 194560, 195103), e(i, 12291, 12291), e(i, 12293, 12293), e(i, 12347, 12347), b.txt.regexen.nonLatinHashtagChars = c(i.join(""));
        var j = [];
        e(j, 192, 214), e(j, 216, 246), e(j, 248, 255), e(j, 256, 591), e(j, 595, 596), e(j, 598, 599), e(j, 601, 601), e(j, 603, 603), e(j, 611, 611), e(j, 616, 616), e(j, 623, 623), e(j, 626, 626), e(j, 649, 649), e(j, 651, 651), e(j, 699, 699), e(j, 768, 879), e(j, 7680, 7935), b.txt.regexen.latinAccentChars = c(j.join("")), b.txt.regexen.hashSigns = /[#＃]/, b.txt.regexen.hashtagAlpha = c(/[a-z_#{latinAccentChars}#{nonLatinHashtagChars}]/i), b.txt.regexen.hashtagAlphaNumeric = c(/[a-z0-9_#{latinAccentChars}#{nonLatinHashtagChars}]/i), b.txt.regexen.endHashtagMatch = c(/^(?:#{hashSigns}|:\/\/)/), b.txt.regexen.hashtagBoundary = c(/(?:^|$|[^&a-z0-9_#{latinAccentChars}#{nonLatinHashtagChars}])/), b.txt.regexen.validHashtag = c(/(#{hashtagBoundary})(#{hashSigns})(#{hashtagAlphaNumeric}*#{hashtagAlpha}#{hashtagAlphaNumeric}*)/gi), b.txt.regexen.validMentionPrecedingChars = /(?:^|[^a-zA-Z0-9_!#$%&*@＠]|RT:?)/, b.txt.regexen.atSigns = /[@＠]/, b.txt.regexen.validMentionOrList = c("(#{validMentionPrecedingChars})(#{atSigns})([a-zA-Z0-9_]{1,20})(/[a-zA-Z][a-zA-Z0-9_-]{0,24})?", "g"), b.txt.regexen.validReply = c(/^(?:#{spaces})*#{atSigns}([a-zA-Z0-9_]{1,20})/), b.txt.regexen.endMentionMatch = c(/^(?:#{atSigns}|[#{latinAccentChars}]|:\/\/)/), b.txt.regexen.validUrlPrecedingChars = c(/(?:[^A-Za-z0-9@＠$#＃#{invalid_chars_group}]|^)/), b.txt.regexen.invalidUrlWithoutProtocolPrecedingChars = /[-_.\/]$/, b.txt.regexen.invalidDomainChars = d("#{punct}#{spaces_group}#{invalid_chars_group}", b.txt.regexen), b.txt.regexen.validDomainChars = c(/[^#{invalidDomainChars}]/), b.txt.regexen.validSubdomain = c(/(?:(?:#{validDomainChars}(?:[_-]|#{validDomainChars})*)?#{validDomainChars}\.)/), b.txt.regexen.validDomainName = c(/(?:(?:#{validDomainChars}(?:-|#{validDomainChars})*)?#{validDomainChars}\.)/), b.txt.regexen.validGTLD = c(/(?:(?:aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|xxx)(?=[^0-9a-zA-Z]|$))/), b.txt.regexen.validCCTLD = c(/(?:(?:ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw|sx)(?=[^0-9a-zA-Z]|$))/), b.txt.regexen.validPunycode = c(/(?:xn--[0-9a-z]+)/), b.txt.regexen.validDomain = c(/(?:#{validSubdomain}*#{validDomainName}(?:#{validGTLD}|#{validCCTLD}|#{validPunycode}))/), b.txt.regexen.validAsciiDomain = c(/(?:(?:[\-a-z0-9#{latinAccentChars}]+)\.)+(?:#{validGTLD}|#{validCCTLD}|#{validPunycode})/gi), b.txt.regexen.invalidShortDomain = c(/^#{validDomainName}#{validCCTLD}$/), b.txt.regexen.validPortNumber = c(/[0-9]+/), b.txt.regexen.validGeneralUrlPathChars = c(/[a-z0-9!\*';:=\+,\.\$\/%#\[\]\-_~@|&#{latinAccentChars}]/i), b.txt.regexen.validUrlBalancedParens = c(/\(#{validGeneralUrlPathChars}+\)/i), b.txt.regexen.validUrlPathEndingChars = c(/[\+\-a-z0-9=_#\/#{latinAccentChars}]|(?:#{validUrlBalancedParens})/i), b.txt.regexen.validUrlPath = c("(?:(?:#{validGeneralUrlPathChars}*(?:#{validUrlBalancedParens}#{validGeneralUrlPathChars}*)*#{validUrlPathEndingChars})|(?:@#{validGeneralUrlPathChars}+/))", "i"), b.txt.regexen.validUrlQueryChars = /[a-z0-9!?\*'@\(\);:&=\+\$\/%#\[\]\-_\.,~|]/i, b.txt.regexen.validUrlQueryEndingChars = /[a-z0-9_&=#\/]/i, b.txt.regexen.extractUrl = c("((#{validUrlPrecedingChars})((https?:\\/\\/)?(#{validDomain})(?::(#{validPortNumber}))?(\\/#{validUrlPath}*)?(\\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?))", "gi"), b.txt.regexen.validTcoUrl = /^https?:\/\/t\.co\/[a-z0-9]+/i, b.txt.regexen.urlHasProtocol = /^https?:\/\//i, b.txt.regexen.urlHasHttps = /^https:\/\//i, b.txt.regexen.cashtag = /[a-z]{1,6}(?:[._][a-z]{1,2})?/i, b.txt.regexen.validCashtag = c("(^|#{spaces})(\\$)(#{cashtag})(?=$|\\s|[#{punct}])", "gi"), b.txt.regexen.validateUrlUnreserved = /[a-z0-9\-._~]/i, b.txt.regexen.validateUrlPctEncoded = /(?:%[0-9a-f]{2})/i, b.txt.regexen.validateUrlSubDelims = /[!$&'()*+,;=]/i, b.txt.regexen.validateUrlPchar = c("(?:#{validateUrlUnreserved}|#{validateUrlPctEncoded}|#{validateUrlSubDelims}|[:|@])", "i"), b.txt.regexen.validateUrlScheme = /(?:[a-z][a-z0-9+\-.]*)/i, b.txt.regexen.validateUrlUserinfo = c("(?:#{validateUrlUnreserved}|#{validateUrlPctEncoded}|#{validateUrlSubDelims}|:)*", "i"), b.txt.regexen.validateUrlDecOctet = /(?:[0-9]|(?:[1-9][0-9])|(?:1[0-9]{2})|(?:2[0-4][0-9])|(?:25[0-5]))/i, b.txt.regexen.validateUrlIpv4 = c(/(?:#{validateUrlDecOctet}(?:\.#{validateUrlDecOctet}){3})/i), b.txt.regexen.validateUrlIpv6 = /(?:\[[a-f0-9:\.]+\])/i, b.txt.regexen.validateUrlIp = c("(?:#{validateUrlIpv4}|#{validateUrlIpv6})", "i"), b.txt.regexen.validateUrlSubDomainSegment = /(?:[a-z0-9](?:[a-z0-9_\-]*[a-z0-9])?)/i, b.txt.regexen.validateUrlDomainSegment = /(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?)/i, b.txt.regexen.validateUrlDomainTld = /(?:[a-z](?:[a-z0-9\-]*[a-z0-9])?)/i, b.txt.regexen.validateUrlDomain = c(/(?:(?:#{validateUrlSubDomainSegment]}\.)*(?:#{validateUrlDomainSegment]}\.)#{validateUrlDomainTld})/i), b.txt.regexen.validateUrlHost = c("(?:#{validateUrlIp}|#{validateUrlDomain})", "i"), b.txt.regexen.validateUrlUnicodeSubDomainSegment = /(?:(?:[a-z0-9]|[^\u0000-\u007f])(?:(?:[a-z0-9_\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i, b.txt.regexen.validateUrlUnicodeDomainSegment = /(?:(?:[a-z0-9]|[^\u0000-\u007f])(?:(?:[a-z0-9\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i, b.txt.regexen.validateUrlUnicodeDomainTld = /(?:(?:[a-z]|[^\u0000-\u007f])(?:(?:[a-z0-9\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i, b.txt.regexen.validateUrlUnicodeDomain = c(/(?:(?:#{validateUrlUnicodeSubDomainSegment}\.)*(?:#{validateUrlUnicodeDomainSegment}\.)#{validateUrlUnicodeDomainTld})/i), b.txt.regexen.validateUrlUnicodeHost = c("(?:#{validateUrlIp}|#{validateUrlUnicodeDomain})", "i"), b.txt.regexen.validateUrlPort = /[0-9]{1,5}/, b.txt.regexen.validateUrlUnicodeAuthority = c("(?:(#{validateUrlUserinfo})@)?(#{validateUrlUnicodeHost})(?::(#{validateUrlPort}))?", "i"), b.txt.regexen.validateUrlAuthority = c("(?:(#{validateUrlUserinfo})@)?(#{validateUrlHost})(?::(#{validateUrlPort}))?", "i"), b.txt.regexen.validateUrlPath = c(/(\/#{validateUrlPchar}*)*/i), b.txt.regexen.validateUrlQuery = c(/(#{validateUrlPchar}|\/|\?)*/i), b.txt.regexen.validateUrlFragment = c(/(#{validateUrlPchar}|\/|\?)*/i), b.txt.regexen.validateUrlUnencoded = c("^(?:([^:/?#]+):\\/\\/)?([^/?#]*)([^?#]*)(?:\\?([^#]*))?(?:#(.*))?$", "i");
        var k = "tweet-url list-slug",
            l = "tweet-url username",
            m = "tweet-url hashtag",
            n = "tweet-url cashtag",
            o = {
                urlClass: !0,
                listClass: !0,
                usernameClass: !0,
                hashtagClass: !0,
                cashtagClass: !0,
                usernameUrlBase: !0,
                listUrlBase: !0,
                hashtagUrlBase: !0,
                cashtagUrlBase: !0,
                usernameUrlBlock: !0,
                listUrlBlock: !0,
                hashtagUrlBlock: !0,
                linkUrlBlock: !0,
                usernameIncludeSymbol: !0,
                suppressLists: !0,
                suppressNoFollow: !0,
                targetBlank: !0,
                suppressDataScreenName: !0,
                urlEntities: !0,
                symbolTag: !0,
                textWithSymbolTag: !0,
                urlTarget: !0,
                invisibleTagAttrs: !0,
                linkAttributeBlock: !0,
                linkTextBlock: !0,
                htmlEscapeNonEntities: !0
            }, p = {
                disabled: !0,
                readonly: !0,
                multiple: !0,
                checked: !0
            };
        b.txt.tagAttrs = function(a) {
            var c = "";
            for (var d in a) {
                var e = a[d];
                p[d] && (e = e ? d : null);
                if (e == null) continue;
                c += " " + b.txt.htmlEscape(d) + '="' + b.txt.htmlEscape(e.toString()) + '"'
            }
            return c
        }, b.txt.linkToText = function(a, c, e, f) {
            f.suppressNoFollow || (e.rel = "nofollow"), f.linkAttributeBlock && f.linkAttributeBlock(a, e), f.linkTextBlock && (c = f.linkTextBlock(a, c));
            var g = {
                text: c,
                attr: b.txt.tagAttrs(e)
            };
            return d("<a#{attr}>#{text}</a>", g)
        }, b.txt.linkToTextWithSymbol = function(a, c, d, e, f) {
            var g = f.symbolTag ? "<" + f.symbolTag + ">" + c + "</" + f.symbolTag + ">" : c;
            d = b.txt.htmlEscape(d);
            var h = f.textWithSymbolTag ? "<" + f.textWithSymbolTag + ">" + d + "</" + f.textWithSymbolTag + ">" : d;
            return f.usernameIncludeSymbol || !c.match(b.txt.regexen.atSigns) ? b.txt.linkToText(a, g + h, e, f) : g + b.txt.linkToText(a, h, e, f)
        }, b.txt.linkToHashtag = function(a, c, d) {
            var e = c.substring(a.indices[0], a.indices[0] + 1),
                f = b.txt.htmlEscape(a.hashtag),
                g = q(d.htmlAttrs || {});
            return g.href = d.hashtagUrlBase + f, g.title = "#" + f, g["class"] = d.hashtagClass, f[0].match(b.txt.regexen.rtl_chars) && (g["class"] += " rtl"), d.targetBlank && (g.target = "_blank"), b.txt.linkToTextWithSymbol(a, e, f, g, d)
        }, b.txt.linkToCashtag = function(a, c, d) {
            var e = b.txt.htmlEscape(a.cashtag),
                f = q(d.htmlAttrs || {});
            return f.href = d.cashtagUrlBase + e, f.title = "$" + e, f["class"] = d.cashtagClass, d.targetBlank && (f.target = "_blank"), b.txt.linkToTextWithSymbol(a, "$", e, f, d)
        }, b.txt.linkToMentionAndList = function(a, c, d) {
            var e = c.substring(a.indices[0], a.indices[0] + 1),
                f = b.txt.htmlEscape(a.screenName),
                g = b.txt.htmlEscape(a.listSlug),
                h = a.listSlug && !d.suppressLists,
                i = q(d.htmlAttrs || {});
            return i["class"] = h ? d.listClass : d.usernameClass, i.href = h ? d.listUrlBase + f + g : d.usernameUrlBase + f, !h && !d.suppressDataScreenName && (i["data-screen-name"] = f), d.targetBlank && (i.target = "_blank"), b.txt.linkToTextWithSymbol(a, e, h ? f + g : f, i, d)
        }, b.txt.linkToUrl = function(a, c, d) {
            var e = a.url,
                f = e,
                g = b.txt.htmlEscape(f),
                h = d.urlEntities && d.urlEntities[e] || a;
            h.display_url && (g = b.txt.linkTextWithEntity(h, d));
            var i = q(d.htmlAttrs || {});
            return e.match(b.txt.regexen.urlHasProtocol) || (e = "http://" + e), i.href = e, i.title = e,d.targetBlank && (i.target = "_blank"), d.urlClass && (i["class"] = d.urlClass), d.urlTarget && (i.target = d.urlTarget), !d.title && h.display_url && (i.title = h.expanded_url), b.txt.linkToText(a, g, i, d)
        }, b.txt.linkTextWithEntity = function(a, c) {
            var e = a.display_url,
                f = a.expanded_url,
                g = e.replace(/…/g, "");
            if (f.indexOf(g) != -1) {
                var h = f.indexOf(g),
                    i = {
                        displayUrlSansEllipses: g,
                        beforeDisplayUrl: f.substr(0, h),
                        afterDisplayUrl: f.substr(h + g.length),
                        precedingEllipsis: e.match(/^…/) ? "…" : "",
                        followingEllipsis: e.match(/…$/) ? "…" : ""
                    };
                for (var j in i) i.hasOwnProperty(j) && (i[j] = b.txt.htmlEscape(i[j]));
                return i.invisible = c.invisibleTagAttrs, d("<span class='tco-ellipsis'>#{precedingEllipsis}<span #{invisible}>&nbsp;</span></span><span #{invisible}>#{beforeDisplayUrl}</span><span class='js-display-url'>#{displayUrlSansEllipses}</span><span #{invisible}>#{afterDisplayUrl}</span><span class='tco-ellipsis'><span #{invisible}>&nbsp;</span>#{followingEllipsis}</span>", i)
            }
            return e
        }, b.txt.autoLinkEntities = function(a, c, d) {
            d = q(d || {}), d.hashtagClass = d.hashtagClass || m, d.hashtagUrlBase = d.hashtagUrlBase || "https://twitter.com/#!/search?q=%23", d.cashtagClass = d.cashtagClass || n, d.cashtagUrlBase = d.cashtagUrlBase || "https://twitter.com/#!/search?q=%24", d.listClass = d.listClass || k, d.usernameClass = d.usernameClass || l, d.usernameUrlBase = d.usernameUrlBase || "https://twitter.com/", d.listUrlBase = d.listUrlBase || "https://twitter.com/", d.htmlAttrs = b.txt.extractHtmlAttrsFromOptions(d), d.invisibleTagAttrs = d.invisibleTagAttrs || "style='position:absolute;left:-9999px;'";
            var e, f, g;
            if (d.urlEntities) {
                e = {};
                for (f = 0, g = d.urlEntities.length; f < g; f++) e[d.urlEntities[f].url] = d.urlEntities[f];
                d.urlEntities = e
            }
            var h = "",
                i = 0;
            c.sort(function(a, b) {
                return a.indices[0] - b.indices[0]
            });
            var j = d.htmlEscapeNonEntities ? b.txt.htmlEscape : function(a) {
                return a
            };
            for (var f = 0; f < c.length; f++) {
                var o = c[f];
                h += j(a.substring(i, o.indices[0])), o.url ? h += b.txt.linkToUrl(o, a, d) : o.hashtag ? h += b.txt.linkToHashtag(o, a, d) : o.screenName ? h += b.txt.linkToMentionAndList(o, a, d) : o.cashtag && (h += b.txt.linkToCashtag(o, a, d)), i = o.indices[1]
            }
            return h += j(a.substring(i, a.length)), h
        }, b.txt.autoLinkWithJSON = function(a, c, d) {
            var e = [];
            for (var f in c) e = e.concat(c[f]);
            for (var g = 0; g < e.length; g++) entity = e[g], entity.screen_name ? entity.screenName = entity.screen_name : entity.text && (entity.hashtag = entity.text);
            return b.txt.modifyIndicesFromUnicodeToUTF16(a, e), b.txt.autoLinkEntities(a, e, d)
        }, b.txt.extractHtmlAttrsFromOptions = function(a) {
            var b = {};
            for (var c in a) {
                var d = a[c];
                if (o[c]) continue;
                p[c] && (d = d ? c : null);
                if (d == null) continue;
                b[c] = d
            }
            return b
        }, b.txt.autoLink = function(a, c) {
            var d = b.txt.extractEntitiesWithIndices(a, {
                extractUrlsWithoutProtocol: !1
            });
            return b.txt.autoLinkEntities(a, d, c)
        }, b.txt.autoLinkUsernamesOrLists = function(a, c) {
            var d = b.txt.extractMentionsOrListsWithIndices(a);
            return b.txt.autoLinkEntities(a, d, c)
        }, b.txt.autoLinkHashtags = function(a, c) {
            var d = b.txt.extractHashtagsWithIndices(a);
            return b.txt.autoLinkEntities(a, d, c)
        }, b.txt.autoLinkCashtags = function(a, c) {
            var d = b.txt.extractCashtagsWithIndices(a);
            return b.txt.autoLinkEntities(a, d, c)
        }, b.txt.autoLinkUrlsCustom = function(a, c) {
            var d = b.txt.extractUrlsWithIndices(a, {
                extractUrlsWithoutProtocol: !1
            });
            return b.txt.autoLinkEntities(a, d, c)
        }, b.txt.removeOverlappingEntities = function(a) {
            a.sort(function(a, b) {
                return a.indices[0] - b.indices[0]
            });
            var b = a[0];
            for (var c = 1; c < a.length; c++) b.indices[1] > a[c].indices[0] ? (a.splice(c, 1), c--) : b = a[c]
        }, b.txt.extractEntitiesWithIndices = function(a, c) {
            var d = b.txt.extractUrlsWithIndices(a, c).concat(b.txt.extractMentionsOrListsWithIndices(a)).concat(b.txt.extractHashtagsWithIndices(a, {
                checkUrlOverlap: !1
            })).concat(b.txt.extractCashtagsWithIndices(a));
            return d.length == 0 ? [] : (b.txt.removeOverlappingEntities(d), d)
        }, b.txt.extractMentions = function(a) {
            var c = [],
                d = b.txt.extractMentionsWithIndices(a);
            for (var e = 0; e < d.length; e++) {
                var f = d[e].screenName;
                c.push(f)
            }
            return c
        }, b.txt.extractMentionsWithIndices = function(a) {
            var c = [],
                d, e = b.txt.extractMentionsOrListsWithIndices(a);
            for (var f = 0; f < e.length; f++) d = e[f], d.listSlug == "" && c.push({
                screenName: d.screenName,
                indices: d.indices
            });
            return c
        }, b.txt.extractMentionsOrListsWithIndices = function(a) {
            if (!a || !a.match(b.txt.regexen.atSigns)) return [];
            var c = [],
                d;
            return a.replace(b.txt.regexen.validMentionOrList, function(a, d, e, f, g, h, i) {
                var j = i.slice(h + a.length);
                if (!j.match(b.txt.regexen.endMentionMatch)) {
                    g = g || "";
                    var k = h + d.length,
                        l = k + f.length + g.length + 1;
                    c.push({
                        screenName: f,
                        listSlug: g,
                        indices: [k, l]
                    })
                }
            }), c
        }, b.txt.extractReplies = function(a) {
            if (!a) return null;
            var c = a.match(b.txt.regexen.validReply);
            return !c || RegExp.rightContext.match(b.txt.regexen.endMentionMatch) ? null : c[1]
        }, b.txt.extractUrls = function(a, c) {
            var d = [],
                e = b.txt.extractUrlsWithIndices(a, c);
            for (var f = 0; f < e.length; f++) d.push(e[f].url);
            return d
        }, b.txt.extractUrlsWithIndices = function(a, c) {
            c || (c = {
                extractUrlsWithoutProtocol: !0
            });
            if (!a || (c.extractUrlsWithoutProtocol ? !a.match(/\./) : !a.match(/:/))) return [];
            var d = [];
            while (b.txt.regexen.extractUrl.exec(a)) {
                var e = RegExp.$2,
                    f = RegExp.$3,
                    g = RegExp.$4,
                    h = RegExp.$5,
                    i = RegExp.$7,
                    j = b.txt.regexen.extractUrl.lastIndex,
                    k = j - f.length;
                if (!g) {
                    if (!c.extractUrlsWithoutProtocol || e.match(b.txt.regexen.invalidUrlWithoutProtocolPrecedingChars)) continue;
                    var l = null,
                        m = !1,
                        n = 0;
                    h.replace(b.txt.regexen.validAsciiDomain, function(a) {
                        var c = h.indexOf(a, n);
                        n = c + a.length, l = {
                            url: a,
                            indices: [k + c, k + n]
                        }, m = a.match(b.txt.regexen.invalidShortDomain), m || d.push(l)
                    });
                    if (l == null) continue;
                    i && (m && d.push(l), l.url = f.replace(h, l.url), l.indices[1] = j)
                } else f.match(b.txt.regexen.validTcoUrl) && (f = RegExp.lastMatch, j = k + f.length), d.push({
                    url: f,
                    indices: [k, j]
                })
            }
            return d
        }, b.txt.extractHashtags = function(a) {
            var c = [],
                d = b.txt.extractHashtagsWithIndices(a);
            for (var e = 0; e < d.length; e++) c.push(d[e].hashtag);
            return c
        }, b.txt.extractHashtagsWithIndices = function(a, c) {
            c || (c = {
                checkUrlOverlap: !0
            });
            if (!a || !a.match(b.txt.regexen.hashSigns)) return [];
            var d = [];
            a.replace(b.txt.regexen.validHashtag, function(a, c, e, f, g, h) {
                var i = h.slice(g + a.length);
                if (i.match(b.txt.regexen.endHashtagMatch)) return;
                var j = g + c.length,
                    k = j + f.length + 1;
                d.push({
                    hashtag: f,
                    indices: [j, k]
                })
            });
            if (c.checkUrlOverlap) {
                var e = b.txt.extractUrlsWithIndices(a);
                if (e.length > 0) {
                    var f = d.concat(e);
                    b.txt.removeOverlappingEntities(f), d = [];
                    for (var g = 0; g < f.length; g++) f[g].hashtag && d.push(f[g])
                }
            }
            return d
        }, b.txt.extractCashtags = function(a) {
            var c = [],
                d = b.txt.extractCashtagsWithIndices(a);
            for (var e = 0; e < d.length; e++) c.push(d[e].cashtag);
            return c
        }, b.txt.extractCashtagsWithIndices = function(a) {
            if (!a || a.indexOf("$") == -1) return [];
            var c = [];
            return a.replace(b.txt.regexen.validCashtag, function(a, b, d, e, f, g) {
                var h = f + b.length,
                    i = h + e.length + 1;
                c.push({
                    cashtag: e,
                    indices: [h, i]
                })
            }), c
        }, b.txt.modifyIndicesFromUnicodeToUTF16 = function(a, c) {
            b.txt.convertUnicodeIndices(a, c, !1)
        }, b.txt.modifyIndicesFromUTF16ToUnicode = function(a, c) {
            b.txt.convertUnicodeIndices(a, c, !0)
        }, b.txt.getUnicodeTextLength = function(a) {
            return a.replace(b.txt.regexen.non_bmp_code_pairs, " ").length
        }, b.txt.convertUnicodeIndices = function(a, b, c) {
            if (b.length == 0) return;
            var d = 0,
                e = 0;
            b.sort(function(a, b) {
                return a.indices[0] - b.indices[0]
            });
            var f = 0,
                g = b[0];
            while (d < a.length) {
                if (g.indices[0] == (c ? d : e)) {
                    var h = g.indices[1] - g.indices[0];
                    g.indices[0] = c ? e : d, g.indices[1] = g.indices[0] + h, f++;
                    if (f == b.length) break;
                    g = b[f]
                }
                var i = a.charCodeAt(d);
                55296 <= i && i <= 56319 && d < a.length - 1 && (i = a.charCodeAt(d + 1), 56320 <= i && i <= 57343 && d++), e++, d++
            }
        }, b.txt.splitTags = function(a) {
            var b = a.split("<"),
                c, d = [],
                e;
            for (var f = 0; f < b.length; f += 1) {
                e = b[f];
                if (!e) d.push("");
                else {
                    c = e.split(">");
                    for (var g = 0; g < c.length; g += 1) d.push(c[g])
                }
            }
            return d
        }, b.txt.hitHighlight = function(a, c, d) {
            var e = "em";
            c = c || [], d = d || {};
            if (c.length === 0) return a;
            var f = d.tag || e,
                g = ["<" + f + ">", "</" + f + ">"],
                h = b.txt.splitTags(a),
                i, j, k = "",
                l = 0,
                m = h[0],
                n = 0,
                o = 0,
                p = !1,
                q = m,
                r = [],
                s, t, u, v, w;
            for (i = 0; i < c.length; i += 1) for (j = 0; j < c[i].length; j += 1) r.push(c[i][j]);
            for (s = 0; s < r.length; s += 1) {
                t = r[s], u = g[s % 2], v = !1;
                while (m != null && t >= n + m.length) k += q.slice(o), p && t === n + q.length && (k += u, v = !0), h[l + 1] && (k += "<" + h[l + 1] + ">"), n += q.length, o = 0, l += 2, m = h[l], q = m, p = !1;
                !v && m != null ? (w = t - n, k += q.slice(o, w) + u, o = w, s % 2 === 0 ? p = !0 : p = !1) : v || (v = !0, k += u)
            }
            if (m != null) {
                o < q.length && (k += q.slice(o));
                for (s = l + 1; s < h.length; s += 1) k += s % 2 === 0 ? h[s] : "<" + h[s] + ">"
            }
            return k
        };
        var r = 140,
            s = [f(65534), f(65279), f(65535), f(8234), f(8235), f(8236), f(8237), f(8238)];
        b.txt.getTweetLength = function(a, c) {
            c || (c = {
                short_url_length: 22,
                short_url_length_https: 23
            });
            var d = b.txt.getUnicodeTextLength(a),
                e = b.txt.extractUrlsWithIndices(a);
            b.txt.modifyIndicesFromUTF16ToUnicode(a, e);
            for (var f = 0; f < e.length; f++) d += e[f].indices[0] - e[f].indices[1], e[f].url.toLowerCase().match(b.txt.regexen.urlHasHttps) ? d += c.short_url_length_https : d += c.short_url_length;
            return d
        }, b.txt.isInvalidTweet = function(a) {
            if (!a) return "empty";
            if (b.txt.getTweetLength(a) > r) return "too_long";
            for (var c = 0; c < s.length; c++) if (a.indexOf(s[c]) >= 0) return "invalid_characters";
            return !1
        }, b.txt.isValidTweetText = function(a) {
            return !b.txt.isInvalidTweet(a)
        }, b.txt.isValidUsername = function(a) {
            if (!a) return !1;
            var c = b.txt.extractMentions(a);
            return c.length === 1 && c[0] === a.slice(1)
        };
        var t = c(/^#{validMentionOrList}$/);
        b.txt.isValidList = function(a) {
            var b = a.match(t);
            return !!b && b[1] == "" && !! b[4]
        }, b.txt.isValidHashtag = function(a) {
            if (!a) return !1;
            var c = b.txt.extractHashtags(a);
            return c.length === 1 && c[0] === a.slice(1)
        }, b.txt.isValidUrl = function(a, c, d) {
            c == null && (c = !0), d == null && (d = !0);
            if (!a) return !1;
            var e = a.match(b.txt.regexen.validateUrlUnencoded);
            if (!e || e[0] !== a) return !1;
            var f = e[1],
                g = e[2],
                h = e[3],
                i = e[4],
                j = e[5];
            return (!d || u(f, b.txt.regexen.validateUrlScheme) && f.match(/^https?$/i)) && u(h, b.txt.regexen.validateUrlPath) && u(i, b.txt.regexen.validateUrlQuery, !0) && u(j, b.txt.regexen.validateUrlFragment, !0) ? c && u(g, b.txt.regexen.validateUrlUnicodeAuthority) || !c && u(g, b.txt.regexen.validateUrlAuthority) : !1
        }
    })(), twitterText = b.txt
}()