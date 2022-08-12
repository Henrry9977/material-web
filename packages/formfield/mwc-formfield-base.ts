/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

// tslint:disable:no-new-decorators

import {MDCFormFieldAdapter} from '@material/form-field/adapter.js';
import MDCFormFieldFoundation from '@material/form-field/foundation.js';
import {BaseElement, EventType, SpecificEventListener} from '@material/mwc-base/base-element.js';
import {FormElement} from '@material/mwc-base/form-element.js';
import {observer} from '@material/mwc-base/observer.js';
import {html} from 'lit';
import {property, query, queryAssignedNodes} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';


export class FormfieldBase extends BaseElement {
  @property({type: Boolean}) alignEnd = false;
  @property({type: Boolean}) spaceBetween = false;
  @property({type: Boolean}) nowrap = false;

  @property({type: String})
  @observer(async function(this: FormfieldBase, label: string) {
    this.input?.setAttribute('aria-label', label);
  })
  label = '';

  @query('.mdc-form-field') protected mdcRoot!: HTMLElement;

  protected mdcFoundation!: MDCFormFieldFoundation;

  protected readonly mdcFoundationClass = MDCFormFieldFoundation;

  protected createAdapter(): MDCFormFieldAdapter {
    return {
      registerInteractionHandler:
          <K extends EventType>(type: K, handler: SpecificEventListener<K>) => {
            this.labelEl.addEventListener(type, handler);
          },
      deregisterInteractionHandler:
          <K extends EventType>(type: K, handler: SpecificEventListener<K>) => {
            this.labelEl.removeEventListener(type, handler);
          },
      activateInputRipple: async () => {
        const input = this.input;
        if (input instanceof FormElement) {
          const ripple = await input.ripple;
          if (ripple) {
            ripple.startPress();
          }
        }
      },
      deactivateInputRipple: async () => {
        const input = this.input;
        if (input instanceof FormElement) {
          const ripple = await input.ripple;
          if (ripple) {
            ripple.endPress();
          }
        }
      },
    };
  }

  @queryAssignedNodes('', true, '*')
  protected slottedInputs!: HTMLElement[]|null;

  @query('label') protected labelEl!: HTMLLabelElement;

  protected get input() {
    return this.slottedInputs?.[0] ?? null;
  }

  protected override render() {
    const classes = {
      'mdc-form-field--align-end': this.alignEnd,
      'mdc-form-field--space-between': this.spaceBetween,
      'mdc-form-field--nowrap': this.nowrap
    };

    return html`
      <div class="mdc-form-field ${classMap(classes)}">
        <slot></slot>
        <label class="mdc-label"
               @click="${this._labelClick}">${this.label}</label>
      </div>`;
  }

  override click() {
    this._labelClick();
  }

  protected _labelClick() {
    const input = this.input;
    if (input) {
      input.focus();
      input.click();
    }
  }
}