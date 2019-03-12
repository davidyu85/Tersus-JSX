# Tersus JSX Macro

Missing the good old days of AngularJS that you can do loops in ng-repeat, as oppose to ugly mix of elements and expressions in JSX while using React?

This babel macro aims to make your JSX cleaner via defining Tersus props, which transforms it into JSX expressions for you. The current version supports:
- if statement (tj-if) simulating ng-if
- map function (tj-for) simulating ng-repeat/ng-for


## tj-if Usage (similar to ng-if)
Simply attach an expression to tj-if prop.

```js
import tersus from 'tersus-jsx.macro';

class App extends Component {
  const a = 0;
  render() {
    return tersus(
      <>
        <div tj-if={a === 0}>Make neater JSX</div>
      </>
    )
  }
}
```

Will be converted to

```js
class App extends Component {
  const a = 0;
  render() {
    return (
      <>
       <>{a === 0 && <div>Make neater JSX</div>}</>
      </>
    )
  }
}
```

## tj-for Usage (similar to ng-repeat/ng-for)
Simply attach an array to tj-for, which formulates ES6 JavaScript map.
The "--value" string will be translated into the actual value variable in map.
The "--index" string will be translated into the index.
If the array contains nested objects, you can define the string "--value.name"
for grabbing the value in the object.

```js
import tersus from 'tersus-jsx.macro';

class App extends Component {
  const a = 0;
  render() {
    return tersus(
      <>
        <div tj-for={['a','b','c','d','e']}>
          <b>{'--value'}</b>
          <i>{'--index'}</i>
        </div>
      </>
    )
  }
}
```

Will be converted to

```js
class App extends Component {
  const a = 0;
  render() {
    return (
      <>
        <>{['a', 'b', 'c', 'd', 'e'].map((value, index) => <div>
          <b>{value}</b>
          <i>{index}</i>
        </div>)}</>
      </>
    )
  }
}
```
## Advance mix use case
Simply attach an expression to tj-if prop.

```js
import tersus from 'tersus-jsx.macro';

class App extends Component {
  const a = 0;
  render() {
    return tersus(
      <>
        <div tj-if={a === 0}>
          <div tj-for={['a','b','c','d','e']}>
            <div tj-if={'--value'=== c}>
              {'--value'}
            </div>
          </div>
        </div> 
      </>
    )
  }
}
```

Will be converted to

```js
class App extends Component {
  const a = 0;
  render() {
    return (
      <>
        <>{a === 0 && <div>
          <>{['a', 'b', 'c', 'd', 'e'].map((value, index) => <div>
            <>{value === c && <div>
              {value}
            </div>}</>
          </div>)}</>
        </div>}</> 
      </>
    )
  }
}
```

## Known issues
- Having an JSX element with both tj-if and tj-for might produce interesting side effects. For the time being, it is recommended placing the two props in seperate elements.
- A JSX fragment is wrapped around any transpiled elements. This is because without it, it will generate a meaningless error - container is falsy.
- (MAJOR)Tersus conveniently removes all attributes without checking. A silly mistake from me. Will fix this asap!

## License

MIT
