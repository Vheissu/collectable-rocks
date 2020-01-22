import Aurelia, { StyleConfiguration } from 'aurelia';
import { App } from './app';

Aurelia.register(StyleConfiguration.shadowDOM()).app(App).start();
