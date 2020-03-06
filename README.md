# Angular Unit Test 入门

在开始写单元测试之前，首先需要搞清楚一个问题：**什么是单元测试 Unit Test？**   
**单元测试**：单元测试是开发人员编写的、用于检测在特定条件下目标代码正确性的代码，是指对软件中的最小可测试单元进行检查和验证。单元测试是在软件开发过程中要进行的最低级别的测试活动，软件的独立单元将在与程序的其他部分相隔离的情况下进行测试。    
**划重点：** 单元测试只关注于功能代码，与数据库，后台请求等通通无关。若功能涉及到service，router等，可通过fakeService及fakeRouter进行处理。    

以下通过几个简单的demo来详细了解单元测试的写法及思路，下面的例子从方法类的测试开始，暂时不涉及对template渲染，component依赖，交互等内容的测试，仅为了复盘自己的学习过程，虚心接受批评指正。
[demo github 地址](https://github.com/sunrun93/unit-test)     
注： 该项目代码只为了解单元测试的具体写法及基本思路，src/app目录下（01-07）分别对应功能代码和测试代码，无需关注功能代码本身的业务逻辑。下载或clone代码到本地
```
npm i   //安装依赖
ng test  //运行单元测试
```

### 1. 简单计算方法的unit test    
以下是一个简单的计算方法，功能代码中有一处if判断，因此有两个测试分支，即number<0和number>=0的情况，因此至少需要有两个测试用例才能覆盖该方法。
```
// compute.ts
export function compute (number) {
  if (number < 0) {
      number = 0;
      return number;
  } else {
    return number + 1;
  }
}
```
unit test：
```
// compute.spec.ts
describe('compute', () => {

  it('should return 0 if input is negative', () => {
    const result = compute(-1);
    expect(result).toBe(0);
  });

  it('should return 1 if input is 0', () => {
    const result = compute(0);
    expect(result).toBe(1);
  });

});
```
以上测试代码中，describe方法定义了一组测试用例的集合，it方法定义一个具体的测试用例，expect和toBe()方法进行断言，这都是Jasmine的基本语法，不在此处赘述。可参考[Angular Test Basic](https://github.com/sunrun93/app-test), [Jasmine 语法入门 part I](https://github.com/sunrun93/app-test/blob/master/src/assets/docs/part_1.md).    

以上构造了两个测试用例，通过input的不同，使测试条件分别满足功能代码中的两个分支，即number<0和number>=0，判断输出是否符合预期。  

一个完整的单元测试，务必覆盖功能代码中全部的分支。尤其是的存在if或switch的条件判断时，要考虑到所有的情况进行测试。   

通常，可以将一个测试用例分为三部分: Arrange=>Act=>Assert，上述测试用例是针对一个具体的方法的测试，因此省略了Arrange部分，可以直接调用（Act）并断言（Assert）。

### 2. 对string和array方法的unit test
定义一个简单的方法，返回一个包含三种货币的数组：

```
// getCurrency.ts
export function getCurrency() {
  return ['CHY', 'USD', 'EUR'];
}
```
对应的测试代码：
```
// getCurrency.spec.ts
describe('getCUrrency', () => {
  it('should contain the correct currency', () => {
    // Act
    const result = getCurrency();
    // Asset
    expect(result).toContain('CHY');
    expect(result).toContain('USD');
    expect(result).toContain('EUR');
  });
});
```
对于数组元素的测试，通常我们可以在断言中常用toContain,toBe(length),index等方法。    

接下来，定义一个简单的方法接收一个参数，并返回固定格式的string。
```
// sayHello.ts
export function sayHello(name) {
  return `Hello ${name} !!`;
}
```
测试代码：
```
// sayHello.spec.ts
describe('sayHello', () => {
  it('should contains the input name', () => {
    // Act
    const result = sayHello('Reina');
    // Asset
    expect(result).toContain('Reina');
    // expect(result).toBe('Hello Reina !!');
  });
});
```
在以上的测试代码中，不建议使用expect(result).toBe('Hello Reina !!')进行断言，若使用toBe的判断，则任何改动都会使测试代码fail,这样的测试过于脆弱。

### 3. 对简单component的unit test
以下定义了一个简单的vote组件（此处不考虑template,stylesheet等），包含upVote和downVote两个方法，分别控制totalVote的加减。

```
// vote.component.ts
export class VoteComponent {
  totalVotes = 0;

  upVote() {
    this.totalVotes++;
  }

  downVote() {
    this.totalVotes--;
  }

}
```
针对upVote()和downVote()两个方法，分别定义两个测试用例，在每个测试用例中，我们都需要初始化一个voteComponent，以保证两个测试用例相互独立，totalVotes不会相互影响：
```
describe('vote', () => {

  it('should increment the totalvotes when upvote', () => {
    // Arrange
    const component = new VoteComponent();
    // Act
    component.upVote();
    // Assert
    expect(component.totalVotes).toBe(1);
  });

  it('should decrement the totalvotes when downvote', () => {
    // Arrange
    const component = new VoteComponent();
    // Act
    component.downVote();
    // Assert
    expect(component.totalVotes).toBe(-1);
  });

});
```
随着测试量的增加，可能需要在多个测试用例中对组件进行初始化，会造成很多重复的代码，这种情况下可以使用beforeEach来重构。
```
describe('vote', () => {
  let component: VoteComponent;

  beforeEach(() => {
    component = new VoteComponent();
  });

  it('should increment the totalvotes when upvote', () => {
    // Act
    component.upVote();
    // Assert
    expect(component.totalVotes).toBe(1);
  });

  it('should decrement the totalvotes when downvote', () => {
    // Act
    component.downVote();
    // Assert
    expect(component.totalVotes).toBe(-1);
  });

});
```
上述测试代码中，首先声明一个component变量但不进行初始化，将初始化代码放在beforeEach中，这是在每个测试用例运行前，beforeEach中的代码都会被执行。    
除了beforeEach之外，Jasmine还提供了beforeAll,afterEach,afterAll等方法。根据字面意思，beforeEach和afterEach分别会在每个测试用例的执行前、后执行；而beforeAll和afterAll则分别会在所有的测试用例执行前、后各执行一次。




