function getChildrenRouters(otherRoutes, path, isRootRoute) {
  // 项目路由全路径，如果包含 产品 路由的一部分，则是产品路由的子集
  const children = otherRoutes.filter(it => {
    const { fatherPath, noFrame } = it;
    const isChild = fatherPath === path;
    // noFrame 为 true，isRootRoute 为 true，加入，为false，不要
    if (noFrame) {
      return isRootRoute && isChild;
    }
    // noFrame 为 false，正常判断路由
    return !isRootRoute && isChild;
  });
  return children || [];
}

function getNewRouters(otherRoutes, staticObj, isRootRoute) {
  const { routes = [], path } = staticObj;
  const { length } = routes;
  let resRoutes = [...routes];
  const fatherChildren = getChildrenRouters(otherRoutes, path, isRootRoute);
  if (length <= 0) {
    resRoutes = resRoutes.concat(fatherChildren);
    return resRoutes;
  }
  // 先找自己的children
  const produceRouttes = routes.map(it => {
    const children = getNewRouters(otherRoutes, it, false);
    return {
      ...it,
      routes: children || [],
    };
  });
  resRoutes = [...produceRouttes, ...fatherChildren];
  return resRoutes;
}
function mergeRoutes(otherRoutes, staticRoutes) {
  const newRoutes = staticRoutes.map(item => {
    const { redirect } = item;
    // 排除重定向路由
    if (redirect) {
      return { ...item };
    }
    // 项目路由全路径，如果包含 产品 路由的一部分，则是产品路由的子集
    const mergedRoutes = getNewRouters(otherRoutes, item, true) || [];
    if (mergedRoutes.length > 0) {
      return {
        ...item,
        routes: mergedRoutes,
      };
    }
    return { ...item };
  });
  return newRoutes;
}

module.exports = {
  mergeRoutes,
};
