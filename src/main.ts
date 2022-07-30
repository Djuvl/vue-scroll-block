import type { App } from 'vue';

export default {
  install(app: App) {
    app.directive('scroll-block', function (el: HTMLElement) {
      let target: HTMLElement | null = null;
      const findScroll = (v: HTMLElement | null): HTMLElement | null => {
        if (!v) return null;
        // overflow shouldn't be visibale
        if (v.scrollHeight > v.clientHeight || v.scrollLeft > v.clientWidth) return v;
        if (el === v) return null;
        return findScroll(v.parentElement);
      };
      el.addEventListener('touchstart', (e) => {
        target = findScroll(e.target as HTMLElement);
        if (!target) return;
        const position = { x: e.targetTouches[0].screenX, y: e.targetTouches[0].screenY };
        target.addEventListener(
          'touchmove',
          function (e) {
            const delta = { x: e.targetTouches[0].screenX - position.x, y: e.targetTouches[0].screenY - position.y };
            let move = -1;
            if (Math.abs(delta.x) > Math.abs(delta.y)) move = delta.x > 0 ? 0 : 1;
            if (Math.abs(delta.y) > Math.abs(delta.x)) move = delta.y > 0 ? 2 : 3;
            if (
              move === -1 ||
              (move === 0 && this.scrollLeft < 1) ||
              (move === 1 && this.scrollLeft + this.clientWidth > this.scrollWidth - 2) ||
              (move === 2 && this.scrollTop < 1) ||
              (move === 3 && this.scrollTop + this.clientHeight > this.scrollHeight - 2)
            ) {
              target = null;
              e.preventDefault();
            }
          },
          { once: true }
        );
      });
      el.addEventListener('touchmove', (e) => {
        if (!target) return e.preventDefault();
      });
    });
  },
};
