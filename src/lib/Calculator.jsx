import React from 'react';
import ResultPanel, { replacement } from './ResultPanel';
import ButtonPanel from './ButtonPanel';
import { evaluate } from 'mathjs';

import '../style/flex.css';
import '../style/index.css';

export default class Calculator extends React.Component {
  constructor() {
    super();
    this.state = {
      last: '',
      cur: '0'
    };
  }

  onPaste = event => {
    if(event.isTrusted) {
      const data = event.clipboardData || window.clipboardData;
      const pastedData = data.getData('Text')
      let cur;
      replacement.forEach((item) => {
        cur = pastedData.replace(item.dist, item.reg);
      });
      try {
        this.setState({
          cur: evaluate(cur).toString(),
          last: cur
        })
      } catch {
        this.setState({
          last: cur,
          cur: 'Not A Valid Expression'
        })
      }
    }
  }

  onButtonClick = (type)  => {
    const {cur} = this.state
    const lastLetter = cur.slice(-1);
    switch (type) {
      case 'c':
        this.setState({
          last: '',
          cur: '0'
        });
        break;
      case 'back':
        this.setState({ cur: cur === '0' ? cur : cur.slice(0, -1) || '0' });
        break;
      case '=':
        try {
          const output = evaluate(cur).toString()
          this.setState({
            last: cur + '=',
            cur: output
          });
        } catch (e) {
          console.log(e)
          this.setState({
            last: cur + '=',
            cur: 'NaN'
          });
        }
        break;
      case '+':
      case '-':
      case '*':
      case '/':
      if(Number(cur) === 0 && type === '-') {
          this.setState({
            cur: type
          })
          break
        }
        if((lastLetter === '*' && type === '-') || (lastLetter === '/' && type=== '-')){
          this.setState({
            cur: cur + type
          })
          break
        }

        if (lastLetter === '+' || lastLetter === '-' || lastLetter === '*' || lastLetter === '/')
          this.setState({
            cur: cur.slice(0, -1) + type
          });
        else
          this.setState({
            cur: cur + type
          });
        break;
      case '.':
        if (lastLetter !== '.') {
          this.setState({
            cur: cur + type
          });
        }
        break;
      default:
        this.setState({
          cur: cur === '0' ? type : cur + type
        });
        break;
      }
  }
  render() {
    return (
      <div className="react-calculator" onPaste={this.onPaste}>
        <ResultPanel {...this.state} />
        <ButtonPanel onClick={this.onButtonClick}/>
      </div>
    );
  }
}
