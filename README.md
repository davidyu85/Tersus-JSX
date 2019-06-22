# Tersus JSX Macro

Missing the good old days of AngularJS that you can do loops simply with "ng-repeat", as oppose to ugly mix of elements and expressions in JSX while using React?

This Babel-Macro provides useful props for making a better and neater JSX. These props are transformed into appropriate JSX expressions for you by Babel-Macro, so that people can just define props and forget about formulating unintuitive JSX expression, like what we used to do in AngularJS. The current version supports:
- if statement (tj-if) simulating ng-if
- map function (tj-for) simulating ng-repeat/ng-for

This macro is made so that people can just define props and forget about the complicated JSX expression.

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

is equivalent to

```js
class App extends Component {
  const a = 0;
  render() {
    return (
      <>
        {a === 0 && <><div>Make neater JSX</div></>}
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

is equivalent to

```js
class App extends Component {
  const a = 0;
  render() {
    return (
      <>
        {['a', 'b', 'c', 'd', 'e'].map((value, index) => <><div>
          <b>{value}</b>
          <i>{index}</i>
        </div></>)}
      </>
    )
  }
}
```
## Advance mix use-case
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

is equivalent to

```js
class App extends Component {
  const a = 0;
  render() {
    return (
      <>
        {a === 0 && <><div>
          {['a', 'b', 'c', 'd', 'e'].map((value, index) => <><div>
            {value === c && <><div>
              {value}
            </div></>}
          </div></>)}
        </div></>} 
      </>
    )
  }
}
```

## License

MIT
