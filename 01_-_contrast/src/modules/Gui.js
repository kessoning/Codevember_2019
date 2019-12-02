import { GUI } from '../../../libs/dat.gui.module.js';

const Gui = function () {
    this.gui = new GUI();

    this.effectController = {
        maxDistance: 300,
        micSensibility: 1.0
    };

    this.gui.add(this.effectController, "maxDistance", 10, 700);
    this.gui.add(this.effectController, "micSensibility", 0.001, 20.0);
}

export { Gui };
