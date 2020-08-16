

module.exports = async (context) => {
    if (!context.isBot) {
        const params = context.issue({ body: 'Thanks for your comment in this issue.' })
  
        return context.github.issues.createComment(params)
    }
}
