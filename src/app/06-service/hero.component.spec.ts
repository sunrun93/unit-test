import { HeroService } from './hero.service';
import { HeroComponent } from './hero.component';
import { of, empty, throwError } from 'rxjs';

describe('heroComponent', () => {
  let service: HeroService;
  let component: HeroComponent;

   beforeEach(() => {
    service = new HeroService(null);
    component = new HeroComponent(service);
   });

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

   it('should call the service to save changes when new hero is added', () => {
    const spy = spyOn(service, 'addHero').and.returnValue(empty());

    component.add();

    expect(spy).toHaveBeenCalled();
   });

   it('should add the new hero to herolist return from the server', () => {
    spyOn(service, 'addHero').and.returnValue(of('Lee'));

    component.add();

    expect(component.heroList.indexOf('Lee')).toBeGreaterThan(-1);
   });

   it('should set error message with the msg return from server when add new hero throw error', () => {
    const mockError = 'Add Hero Error';
    spyOn(service, 'addHero').and.returnValue(throwError(mockError));

    component.add();

    expect(component.message).toBe(mockError);
   });

   it('should delete the hero with id when user confirm to delete', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      const spy = spyOn(service, 'deleteHero').and.returnValue(empty());

      component.delete(1);

      expect(spy).toHaveBeenCalledWith(1);
   });

   it('should NOT delete the hero with id when user cancel to delete', () => {
    spyOn(window, 'confirm').and.returnValue(false);
      const spy = spyOn(service, 'deleteHero').and.returnValue(empty());

      component.delete(1);

      expect(spy).not.toHaveBeenCalledWith(1);
  });

});

