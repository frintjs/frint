import BaseEvent from './base/Event';

export default function isEvent(event) {
  return event instanceof BaseEvent;
}
