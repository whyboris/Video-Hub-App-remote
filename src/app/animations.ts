import { animate, style, transition, trigger } from '@angular/animations';

export const searchAnimation = trigger('searchAnimation', [
  transition(
    ':enter', [
      style({ transform: 'translate(0, 50px)' }),
      animate('300ms ease', style({ transform: 'translate(0, 0)' }))
    ]
  ),
  transition(
    ':leave', [
      style({ transform: 'translate(0, 0)' }),
      animate('300ms ease', style({ transform: 'translate(0, 50px)' }))
    ]
  )]
);
