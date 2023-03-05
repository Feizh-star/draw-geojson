/**
 * 遍历树，查找指定的节
 * @param {Array} data 树的根
 * @param {String} id 要查找的标识
 * @param {Object} keys 配置对象：children：指明使用哪个属性作为子级测表；id：指明哪个属性作为id（可以族套，例如：'data.id'）
 * @param {Function} compare 自定义比较函数，接收四个参数；树中节点的id值，要查找的id值，当前节点对象，当前节点对象的祖先列表；
 *                   compare 需返回1个boolean值，如果为true，则代表找到了目标
 * @return {Object | null} node：找到的节点对象，其上会多1个’_stack'属性，是1个数组，代表了当前节点在树中的路径（即所有根先）
 */
 export function filterTreeNode(data: any, id: any, keys:any, compare: any, stack: any[] = []): any {
  const childrenKey = keys?.children || 'children'
  let idKey = keys?.id || 'id'
  idKey = idKey.split('.')
  let result = null
  const compareFunc = compare || ((a: any, b: any) => a === b)
  for (const node of data) {
    // 查找指定的键
    const nodeId = idKey.reduce((p: any, c: any) => p && p[c], node)
    if( compareFunc(nodeId, id, node, stack)) {
      result = {...node}
      break
    } else if (node[childrenKey]) {
      stack.push(node)
      result = filterTreeNode(node[childrenKey], id, keys, compare, stack)
      if (result) break
    } else {
      continue 
    }
  }
  if (!result) stack.pop()
  else result._stack = stack 
  return result
}