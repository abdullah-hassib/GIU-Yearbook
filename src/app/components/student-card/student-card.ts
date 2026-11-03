
import { Component, input, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Student } from '../../models/student.model';
import { SavedService } from '../../services/saved.service';

@Component({
  selector: 'app-student-card',
  imports: [RouterLink],
  templateUrl: './student-card.html',
  styleUrl: './student-card.css',
})
export class StudentCard {
  readonly student = input.required<Student>();

  private readonly imageFailed = signal(false);

  protected readonly photoSrc = computed(() =>
    this.imageFailed()
      ? 'images/placeholder-portrait.svg'
      : this.student().photo
  );

  protected onImageError(): void {
    this.imageFailed.set(true);
  }

  // New: shared saved-students service
  private readonly saved = inject(SavedService);

  // New: whether this particular student is saved
  protected readonly isSaved = computed(() =>
    this.saved.isSaved(this.student().id)
  );

  // New: toggle the saved state
  protected onToggleSaved(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.saved.toggle(this.student().id);
  }
}
