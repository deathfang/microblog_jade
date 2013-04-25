moment.fn.twitter = moment.fn.twitterLong = ->
    twitterFormat.call @, 'long'

moment.fn.twitterShort = ->
    twitterFormat.call @, 'short'


twitterFormat = (format) ->
    diff = Math.abs @diff moment()
    unit = null
    num = null

    if diff <= second
        unit = 'seconds'
        num = 1
    else if diff < minute
        unit = 'seconds'
    else if diff < hour
        unit = 'minutes'
    else if diff < day
        unit = 'hours'
    else if format is 'short'
        if diff < week
            unit = 'days'
        else
            return @format 'M/D/YY'
    else
        return @format 'MMMD日'

    unless num and unit
        # Format the number
        num = moment.duration(diff)[unit]()

    unitStr = unit = formats[unit][format]
    # if format is 'long' and num > 1
        # unitStr += 's'

    return num + unitStr

# Times in millisecond
second = 1e3
minute = 6e4
hour = 36e5
day = 864e5
week = 6048e5

formats =
    seconds:
        short: '秒'
        long: '秒'
    minutes:
        short: '分'
        long: '分'
    hours:
        short: '时'
        long: '时'
    days:
        short: '日'
        long: '日'
