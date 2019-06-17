const hasSpecial = str => /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(str)

module.exports = hasSpecial
