
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Student } from '../../models/student.model';
import { SavedService } from '../../services/saved.service';
import { StudentCard } from './student-card';

describe('StudentCard (unit)', () => {
  let fixture: ComponentFixture<StudentCard>;
  let el: HTMLElement;

  // Fake SavedService
  const saved = {
    isSaved: vi.fn(),
    toggle: vi.fn()
  };

  const maya: Student = {
    id: 1,
    name: 'Maya Hassan',
    faculty: 'Engineering',
    classYear: 2026,
    quote: 'Build things that make a difference.',
    photo: 'images/students/maya-hassan.jpg',
    featured: true
  };

  beforeEach(() => {
    saved.isSaved.mockReset();
    saved.isSaved.mockReturnValue(false);
    saved.toggle.mockReset();

    TestBed.configureTestingModule({
      imports: [StudentCard],
      providers: [
        provideRouter([]),
        { provide: SavedService, useValue: saved }
      ]
    });
  });

  async function render(student: Student = maya): Promise<void> {
    fixture = TestBed.createComponent(StudentCard);
    el = fixture.nativeElement;

    fixture.componentRef.setInput('student', student);
    await fixture.whenStable();
  }

  // TEST 1: Student information
  it('shows student information and updates when input changes', async () => {
    await render();

    expect(
      el.querySelector('.student-card__name')?.textContent
    ).toContain('Maya Hassan');

    expect(
      el.querySelector('.student-card__faculty')?.textContent
    ).toContain('Engineering');

    fixture.componentRef.setInput('student', {
      ...maya,
      id: 2,
      name: 'Adam Schneider'
    });

    await fixture.whenStable();

    expect(
      el.querySelector('.student-card__name')?.textContent
    ).toContain('Adam Schneider');
  });

  // TEST 2: Saved heart appearance
  it('shows an active heart when student is saved', async () => {
    saved.isSaved.mockReturnValue(true);

    await render();

    const heart = el.querySelector(
      '.student-card__save'
    ) as HTMLButtonElement;

    expect(heart.getAttribute('aria-pressed')).toBe('true');

    expect(heart.classList).toContain(
      'student-card__save--on'
    );
  });

  // TEST 3: Heart click and event propagation
  it('toggles saved state without propagating the click', async () => {
    await render();

    const card = el.querySelector(
      '.student-card'
    ) as HTMLElement;

    const heart = el.querySelector(
      '.student-card__save'
    ) as HTMLButtonElement;

    const cardClicked = vi.fn();

    card.addEventListener('click', cardClicked);

    const click = new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    });

    heart.dispatchEvent(click);

    expect(saved.toggle).toHaveBeenCalledWith(1);
    expect(click.defaultPrevented).toBe(true);
    expect(cardClicked).not.toHaveBeenCalled();
  });

  // TEST 4: Broken image fallback
  it('shows placeholder portrait when photo fails', async () => {
    await render();

    const photo = el.querySelector(
      '.student-card__image img'
    ) as HTMLImageElement;

    photo.dispatchEvent(new Event('error'));

    await fixture.whenStable();

    expect(photo.getAttribute('src')).toContain(
      'placeholder-portrait.svg'
    );
  });
});
