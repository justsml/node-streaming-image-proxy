


function translateResizeExpression(expression: string): string {
  const numberPairPattern = /^(\d+%?)[x:\/](\d+%?)$/gim
  const widthPattern = /^(\d+%*)w$|^w(\d+%*)$/gim
  const heightPattern = /^(\d+%*)h$|^h(\d+%*)$/gim

  if (numberPairPattern.test(expression))
    return expression.replace(numberPairPattern, '$1x$2')

  if (widthPattern.test(expression))
    return expression.replace(widthPattern, '$1x')
  if (heightPattern.test(expression))
    return expression.replace(heightPattern, 'x$1')

  return expression
}


