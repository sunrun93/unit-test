# Angular Unit Test 入门

在开始写单元测试之前，首先需要搞清楚一个问题：**什么是单元测试 Unit Test？**  

**单元测试**：单元测试是开发人员编写的、用于检测在特定条件下目标代码正确性的代码，是指对软件中的最小可测试单元进行检查和验证。单元测试是在软件开发过程中要进行的最低级别的测试活动，软件的独立单元将在与程序的其他部分相隔离的情况下进行测试。  
  
**划重点：** 单元测试只关注于功能代码，与数据库，后台请求等通通无关。若功能涉及到service，router等，可通过fakeService及fakeRouter进行处理。    

以下通过几个简单的demo来详细了解单元测试的写法及思路，下面的例子从方法类的测试开始，暂时不涉及对template渲染，component依赖，交互等内容的测试，仅为了复盘自己的学习过程，虚心接受批评指正。   

[demo源码](https://github.com/sunrun93/unit-test)         
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

### 4. form表单的unit test
首先，通过FormBuilder初始化一个formgroup,并为其添加两个name和email两个字段，将name规定为必填项。
```
// form.component.ts
export class FormComponent {
  formGroup: FormGroup;

  constructor(fb: FormBuilder) {
    // 初始化一个formgroup,将name设为required
    this.formGroup = fb.group({
      name: ['', Validators.required],
      email: [''],
    });

  }
}
```
分别测试一下三种情况：
1. formGroup应包含name和email两个field
2. name字段为空，form为invalid
3. name字段输入合法值后，form为valid

```
describe('form', () => {

  let component: FormComponent;

  beforeEach(() => {
    // 初始化formComponent时，需要传入一个formBuilder实例
    component = new FormComponent(new FormBuilder());
  });

  it('should create the formGroup with 2 fields', () => {
    expect(component.formGroup.contains('name')).toBeTruthy();
    expect(component.formGroup.contains('email')).toBeTruthy();
  });

  it('should make the name control required', () => {
    const control = component.formGroup.get('name');
    control.setValue('');
    expect(control.valid).toBeFalsy();
  });

  it('should make the name control valid if input acceptable name', () => {
    const control = component.formGroup.get('name');
    control.setValue('Reina');
    expect(control.valid).toBeTruthy();
  });

});

```
以上测试代码，首先在beforeEach中，对formComponent进行初始化，因其构造函数中需要传入一个formBuilder实例，因此在测试代码中，将new FormBuilder()作为参数。   

另外，在上述测试代码中，使用到了formControl和formGroup的属性及方法，并通过toBeFalsy()，toBeTruthy()等方法对布尔值进行判断。

### 5.EventEmitter的Unit Test
再次以VoteComponent方法为例，在该组件中，定义了一个voteChanged方法作为output，在upVote中触发this.voteChanged.emit(this.totalVotes)。
```
// eventEmitter/vote.component.ts
export class VoteComponent {
  totalVotes = 0;
  @Output() voteChanged = new EventEmitter();

  upVote() {
    this.totalVotes ++;
    this.voteChanged.emit(this.totalVotes);
  }
```
对eventEmitter进行测试时，首先要保证对应的output方法会被触发，并且要判断拿到的参数是否正确。另外需要知道，EventEmitter类派生自Observable，可以对其进行订阅，测试用例如下：
```
describe('voteComponent', () => {

  let component: VoteComponent;

  beforeEach(() => {
    component = new VoteComponent();
  });

  it('should trigger voteChanged with totalVotes when upVotes', () => {
    // Arrange
    let totalVotes = null;
    component.voteChanged.subscribe(tv => totalVotes = tv);
    // Act
    component.upVote();
    // Assert
    expect(totalVotes).toBe(1);
  });
});
```
上述测试用例中，首先对VoteChanged进行了订阅，并在其回调中拿到给totalVotes赋值；然后触发update方法，根据totalVotes的值进行断言。

### 6.针对service的unit test
首先，回顾开头提过的，单元测试只关注于功能代码，与数据库，后台请求等通通无关。因此，在对service进行单元测试时，也不应该真正的触发请求，而是通过fakeService进行。至于service请求是否能返回正确的值，属于集成测试的范畴，不在此考虑。   

首先，分别构造一个heroComponent和heroService,heroService为heroComponent提供数据请求,我们将heroService注入到heroComponent中。  

在service中，定义了三个方法分别向后抬发送请求，此处并不关心具体实现及其真正的返回值：
```
// hero.service.ts
export class HeroService {

  constructor(private http: Http) { }

  getHeroes() {
    return this.http.get('...');
  }

  addHero(hero) {
    return this.http.post('...', hero);
  }

  deleteHero(id) {
    return this.http.get('...' + id);
  }
}
```
在heroComponent中，在其初始化时调用service的getHeros方法，并另外定义了add和delete方法分别调用service的addHero和deleteHero的方法。
```
// hero.component.ts
export class HeroComponent implements OnInit {

  heroList: any;
  message: string;

  constructor(private heroService: HeroService ) {}

  ngOnInit() {
    this.heroService.getHeroes().subscribe((res) => {
      this.heroList = res;
    });
  }

  add() {
    let hero = { id: 1, name: 'hero' };
    this.heroService.addHero(hero).subscribe(
      res => { this.heroList.push(res) },
      err => {
        this.message = err;
      }
    );
  }

  delete(id) {
    if ( confirm('Are you sure to delete?')) {
      this.heroService.deleteHero(id);
    }
  }

}
```
因为组件中分三种情况对service方法进行了调用，因此分别来看针对这三种情况的测试用例：   
1. ngOnInit中调用了getHeros方法，并将返回值赋给heroList
2. add方法中调用了addHeros,并分别对请求成功和失败进行了处理
3. delete方法首先使用了window.confirm,确认后调用了deleteHero方法

首先，在beforeEach中对component和service进行初始化，因为测试时并不发送真正的请求，在初始化service可用null代替http，并将service注入component中：
```
describe('heroComponent', () => {
  let service: HeroService;
  let component: HeroComponent;

   beforeEach(() => {
    service = new HeroService(null);
    component = new HeroComponent(service);
   });
  // ......
});
```
初始化完成后，针对第一个功能点（ngOnInit中调用了getHeros方法，并将返回值赋给heroList）进行测试：
```
it('should set heroList with the heros returned from service', () => {
    // Arrange
    const heroes = ['Reina', 'David'];
    spyOn(service, 'getHeroes').and.callFake(() => {
      return of(heroes);
    });
    // Act
    component.ngOnInit();
    // Assert
    expect(component.heroList).toBe(heroes);
});
```
以上测试用例中，用到了spyOn(),spyOn方法可以添加对某个对象下的函数执行情况的监控，该方法接收两个参数，分别为被监视的对象和被监视函数的方法名，spyOn(service, 'getHeroes')则是监视service对象中getHeroes方法；结合and.callFake方法可以伪造监听的方法返回值，此处通过一个自定义函数将heroes数组返回。   

然后调用ngOnInit以触发getHeroes方法，并通过component.heroList与mock的返回值判断执行结果。

除了and.callFake方法外，jasmine还提供了and.returnValue方法可以指定监听的方法返回值；and.throwError方法可以让监听方法执行之后返回一个错误信息,可以通过toThrowError来适配等，可自行查阅[Jasmine文档](https://jasmine.github.io/api/edge/Spy.html)。

接下来，针对第二个功能点（add方法中调用了addHeros,并分别对请求成功和失败进行了处理），测试以下三种情况：   
* service中的addHero方法能够被成功调用；
```
 it('should call the service to save changes when new hero is added', () => {
    const spy = spyOn(service, 'addHero').and.returnValue(empty());

    component.add();

    expect(spy).toHaveBeenCalled();
   });
```
上述测试用例中，监听了service中的addHero方法，因此处只测试方法是否被正常调用，因此不对返回值进行处理，通过rxjs的empty操作符返回一个空数据流，通过toHaveBeenCalled()检查监听函数是否被调用过。
* addHero请求成功时，其返回值能够被添加到heroLists中；
```
it('should add the new hero to herolist return from the server', () => {
  spyOn(service, 'addHero').and.returnValue(of('Lee'));

  component.add();

  expect(component.heroList.indexOf('Lee')).toBeGreaterThan(-1);
  });
```
上述测试用例中，同样通过监听service中的addHero方法，并通过and.returnValue(of('Lee'))方法返回‘Lee’，并通过判断Lee是否被成功的添加到heroList数组中，此处用到了rxjs的of操作符和jasmine中提供的toBeGreaterThan方法。
* addHero报错时，message能够获得错误信息；

```
 it('should set error message with the msg return from server when add new hero throw error', () => {
    const mockError = 'Add Hero Error';
    spyOn(service, 'addHero').and.returnValue(throwError(mockError));

    component.add();

    expect(component.message).toBe(mockError);
});

```
在该测试用例中，同样通过监听service中的addHero方法，并通过and.returnValue方法，结合rxjs的throwError操作符返回错误信息，并判断component的message是否被成功赋值。

最后，对第三个功能点（delete方法首先使用了window.confirm,确认后调用了deleteHero方法）进行测试。分别测试确认删除和取消删除的两种情况：
```
it('should delete the hero with id when user confirm to delete', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const spy = spyOn(service, 'deleteHero').and.returnValue(empty());

    component.delete(1);

    expect(spy).toHaveBeenCalledWith(1);
   });
```
上述测试用例中，首先通过spyOn(window, 'confirm').and.returnValue(true)监听用户confirm的操作，将返回值设为true,即用户确认删除；然后监听service中的deleteHero方法，并通过and.returnValue返回空，最终判断deleteHero方法是否被成功调用，并检查参数信息是否与传入的一致。    

同理，通过spyOn(window, 'confirm').and.returnValue(false)模拟用户取消删除的场景，验证delete方法不被调用。jasmine的常用断言方法，在任何断言方法前面加上not，代表相反的意思。测试用例如下：
```
it('should NOT delete the hero with id when user cancel to delete', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const spy = spyOn(service, 'deleteHero').and.returnValue(empty());

    component.delete(1);

    expect(spy).not.toHaveBeenCalledWith(1);
  });
```

以上，通过简单的示例记录了Angular单元测试的基础入门过程。当然，在实际的项目中，远比这复杂的多，一步步继续挖下去吧～

[demo源码](https://github.com/sunrun93/unit-test)  







