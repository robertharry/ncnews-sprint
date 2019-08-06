exports.formatDates = list => {
    if (!list.length) return []
    const newTimes = list.map(time => {
        const { created_at: value, ...rest } = time;
        const newTime = { created_at: new Date(time.created_at), ...rest }
        return newTime
    })
    return newTimes
};

exports.makeRefObj = list => {
    if (!list.length) return {}
    const refObj = {}
    for (ref in list) {
        refObj[list[ref].title] = list[ref].article_id
    }
    return refObj
};

exports.formatComments = (comments, articleRef) => {
    if (!comments.length) return [];
    const newObj = comments.map(comment => {
        const { created_by: value,
            belongs_to: value2,
            created_at: value3,
            ...rest } = comment;
        const newComment = {
            ['author']: value,
            ['article_id']: articleRef[comment.belongs_to],
            created_at: new Date(comment.created_at),
            ...rest
        }
        return newComment
    })
    return newObj
};

exports.formatOneComment = (comment, id) =>{
   const newObj = {}
   for (name in comment) {
       newObj['author'] = comment.username
       newObj.body = comment.body
       newObj.article_id = id
   }
   return newObj
};