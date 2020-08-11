import { initMixin } from './init.js'
import { renderMixin } from './render.js'
function Due(options) {
    this.init(options);
    this.render(); 
}
initMixin(Due);
renderMixin(Due);
export default Due;