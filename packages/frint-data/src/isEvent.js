import BaseEvent from './base/Event';

export default function isEvent(event) {
  try {
    return event instanceof BaseEvent;
  } catch (e) {
    return false;
  }
}
