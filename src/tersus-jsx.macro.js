const { createMacro } = require('babel-plugin-macros');

const PREFIX = 'tj-'; // Prefix for Tersus props.
const VAR_IDENTIFY = '--';  // Indicator to replace a string into an identifier name.

// Clones the parent node of the prop and defined expressions for later processing.
// This also removes the Tersus props. A "clone" object is formulated, which is
// used across the macro for JSX transformation ("c" is the shortform).
const cloneAndRemoveAttr = (path, t) => {
  const parentPath = path.parentPath.parentPath;
  const expression = t.cloneDeep(path.node.value.expression);
  path.remove();
  const node = t.cloneDeep(parentPath.node);
  return ({ parentPath, expression, node })
};

// Constructs a if statement.
const _if = (c, t) => {
  c.parentPath.replaceWith(
    t.JSXFragment(
    t.JSXOpeningFragment(),
      t.JSXClosingFragment(),
      [
        t.JSXExpressionContainer(
          t.LogicalExpression(
            '&&',
            c.expression,
            c.node
          )
        )
      ]
    )
  );
};

// Constructs a Javascript loop using map.
const _for = (c, t) => {
  c.parentPath.replaceWith(
    t.JSXFragment(
      t.JSXOpeningFragment(),
      t.JSXClosingFragment(),
      [
        t.JSXExpressionContainer(
          t.CallExpression(
            t.MemberExpression(
              c.expression,
              t.Identifier('map')
            ),
            [t.ArrowFunctionExpression(
              [t.Identifier('value'), t.Identifier('index')],
              c.node
            )]
          )
        )
      ]
    )
  );

  c.parentPath.traverse({ // String literals with var_identifier are changed into variables.
    StringLiteral(path) {
      if (path.node.value.match(VAR_IDENTIFY)) {
        path.replaceWith(
          t.Identifier(
            path.node.value.replace(VAR_IDENTIFY, '')
          )
        ) 
      }
    }
  });
};

// Identify anything with a Tersus prop and converts into JSX expressions.
const traverseModifier = (rootPath, t) => {
  rootPath.parentPath.traverse({
    JSXAttribute(path) {
      let attr = path.node.name.name;
      const c = cloneAndRemoveAttr(path, t);
      switch(attr) {
        case `${PREFIX}if`:
          _if(c, t);
          break;

        case `${PREFIX}for`:
          _for(c, t);
          break;

        default:
          break;
      };
    }
  });
};

// Identify and process any JSX elements that is wrapped in a Tersus macro.
const tersusMacro = ({ references, state, babel: { types: t } }) => {
  references.default.forEach(referencePath => {
    traverseModifier(referencePath, t);
    referencePath.node.name = '';
  })
};

module.exports = createMacro(tersusMacro);
