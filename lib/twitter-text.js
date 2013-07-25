//modified only use extractUrls

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
    b.txt.extractUrls = function(a, c) {
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
    }
    b.txt.isValidUrl = function(a, c, d) {
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
})(),module.exports = b.txt