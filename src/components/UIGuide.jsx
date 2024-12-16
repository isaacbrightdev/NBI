/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import Badge from '@/components/Badge';
import Checkbox from '@/components/Checkbox';
import CourseCardShimmer from '@/components/CourseCardShimmer';
import RadioButton from '@/components/RadioButton';
import SelectDropdown from '@/components/SelectDropdown';
import ToggleButton from '@/components/ToggleButton';
import SvgIcon from './SvgIcon';

const UIGuide = () => {
  const [checked, setChecked] = useState(false);
  return (
    <>
      <div className="container-fluid gx-sm max-w-screen-2xl xl:gx-xl">
        <aside className="my-10">
          <ul>
            <li>
              <a href="#colors">Colors</a>
            </li>
            <li>
              <a href="#typography">Typography</a>
            </li>
            <li>
              <a href="#buttonsforms">Buttons & Forms</a>
            </li>
            <li>
              <a href="#icons">Icons</a>
            </li>
            <li>
              <a href="#profile-badge">Profile Badge</a>
            </li>
            <li>
              <a href="#shimmer">Loading Shimmer</a>
            </li>
          </ul>
        </aside>
        <hr />
        <div>
          <section id="#colors" className="my-10">
            <h2>Colors</h2>
            <hr />
            <div className="my-10">
              <h3 className="mb-5">Primary Colors</h3>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Primary</h4>
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="bg-primary"
                    ></div>
                  </div>
                  <p>Color Classes</p>
                  <code>.bg-primary</code>
                  <br />
                  <code>.text-primary</code>
                  <br />
                  <code>.border-primary</code>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Primary: Light</h4>
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="bg-primary-light"
                    ></div>
                  </div>
                  <p>Color Classes</p>
                  <code>.bg-primary-light</code>
                  <br />
                  <code>.text-primary-light</code>
                  <br />
                  <code>.border-primary-light</code>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Secondary</h4>
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="bg-secondary"
                    ></div>
                  </div>
                  <p>Color Classes</p>
                  <code>.bg-secondary</code>
                  <br />
                  <code>.text-secondary</code>
                  <br />
                  <code>.border-secondary</code>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Accent</h4>
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="bg-accent"
                    ></div>
                  </div>
                  <p>Color Classes</p>
                  <code>.bg-accent</code>
                  <br />
                  <code>.text-accent</code>
                  <br />
                  <code>.border-accent</code>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Accent Light</h4>
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="bg-accent-light"
                    ></div>
                  </div>
                  <p>Color Classes</p>
                  <code>.bg-accent-light</code>
                  <br />
                  <code>.text-accent-light</code>
                  <br />
                  <code>.border-accent-light</code>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Accent Dark</h4>
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="bg-accent-dark"
                    ></div>
                  </div>
                  <p>Color Classes</p>
                  <code>.bg-accent-dark</code>
                  <br />
                  <code>.text-accent-dark</code>
                  <br />
                  <code>.border-accent-dark</code>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Accent Text Color</h4>
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="bg-accent-text-color"
                    ></div>
                  </div>
                  <p>Color Classes</p>
                  <code>.bg-accent-text-color</code>
                  <br />
                  <code>.text-accent-text-color</code>
                  <br />
                  <code>.border-accent-text-color</code>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Grey</h4>
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="bg-grey"
                    ></div>
                  </div>
                  <p>Color Classes</p>
                  <code>.bg-grey</code>
                  <br />
                  <code>.text-grey</code>
                  <br />
                  <code>.border-grey</code>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Grey: Light</h4>
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="bg-grey-light"
                    ></div>
                  </div>
                  <p>Color Classes</p>
                  <code>.bg-grey-light</code>
                  <br />
                  <code>.text-grey-light</code>
                  <br />
                  <code>.border-grey-light</code>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Grey: Dark</h4>
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="bg-grey-dark"
                    ></div>
                  </div>
                  <p>Color Classes</p>
                  <code>.bg-grey-dark</code>
                  <br />
                  <code>.text-grey-dark</code>
                  <br />
                  <code>.border-grey-dark</code>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Gradient Light Stop</h4>
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="bg-gradient-light-stop"
                    ></div>
                  </div>
                  <p>Color Classes</p>
                  <code>.bg-gradient-light-stop</code>
                  <br />
                  <code>.text-gradient-light-stop</code>
                  <br />
                  <code>.border-gradient-light-stop</code>
                </div>
              </div>
            </div>
            <div className="my-10">
              <h3 className="mb-5">Status Colors</h3>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Active</h4>
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="bg-active"
                    ></div>
                  </div>
                  <p>Color Classes</p>
                  <code>.bg-active</code>
                  <br />
                  <code>.text-active</code>
                  <br />
                  <code>.border-active</code>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Active: Light</h4>
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="bg-active-light"
                    ></div>
                  </div>
                  <p>Color Classes</p>
                  <code>.bg-active-light</code>
                  <br />
                  <code>.text-active-light</code>
                  <br />
                  <code>.border-active-light</code>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Warning</h4>
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="bg-warn"
                    ></div>
                  </div>
                  <p>Color Classes</p>
                  <code>.bg-warn</code>
                  <br />
                  <code>.text-warn</code>
                  <br />
                  <code>.border-warn</code>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Warning: Light</h4>
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="bg-warn-light"
                    ></div>
                  </div>
                  <p>Color Classes</p>
                  <code>.bg-warn-light</code>
                  <br />
                  <code>.text-warn-light</code>
                  <br />
                  <code>.border-warn-light</code>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Error</h4>
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="bg-error"
                    ></div>
                  </div>
                  <p>Color Classes</p>
                  <code>.bg-error</code>
                  <br />
                  <code>.text-error</code>
                  <br />
                  <code>.border-error</code>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Error: Light</h4>
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="bg-error-light"
                    ></div>
                  </div>
                  <p>Color Classes</p>
                  <code>.bg-error-light</code>
                  <br />
                  <code>.text-error-light</code>
                  <br />
                  <code>.border-error-light</code>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Error: dark</h4>
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                      className="bg-error-dark"
                    ></div>
                  </div>
                  <p>Color Classes</p>
                  <code>.bg-error-dark</code>
                  <br />
                  <code>.text-error-dark</code>
                  <br />
                  <code>.border-error-dark</code>
                </div>
              </div>
            </div>
          </section>
          <hr />
          <section id="#typography" className="my-10">
            <h2>Typography</h2>
            <hr />
            <br />
            <h3>Headings</h3>
            <h1 className="text-h2 lg:text-h1">Heading 1</h1>
            <code>className="lg:text-h1 text-h2"</code>
            <br />
            <br />
            <h2 className="text-h2-mobile lg:text-h2">Heading 2</h2>
            <code>className="lg:text-h2 text-h2-mobile"</code>
            <br />
            <br />
            <h3 className="text-h3-mobile lg:text-h3">Heading 3</h3>
            <code>className="lg:text-h3 text-h3-mobile"</code>
            <br />
            <br />
            <h4 className="text-h4-mobile lg:text-h4">Heading 4</h4>
            <code>className="lg:text-h4 text-h4-mobile"</code>
            <br />
            <br />
            <br />
            <hr />
            <br />
            <p>Body copy</p>
            <code>&lt;p&gt;Body copy&lt;/p&gt;</code>
            <br />
            <br />
            <p className="text-callout">Callout</p>
            <code>className="text-callout"</code>
            <br />
            <br />
            <p className="text-sm-body">Small body</p>
            <code>className="text-sm-body"</code>
            <br />
            <br />
            <p className="text-fine-print">Fine print</p>
            <code>className="text-fine-print"</code>
          </section>
          <hr />
          <section id="buttonsforms" className="my-10">
            <h2>Buttons & Forms</h2>
            <div className="my-10">
              <h3 className="mb-5">Buttons</h3>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <div className="mb-3">
                    <button className="btn">Button</button>
                  </div>
                  <code>className="btn"</code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <div className="mb-3">
                    <button className="btn" disabled>
                      Button
                    </button>
                  </div>
                  <code>className="btn" disabled</code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <div className="mb-3">
                    <button className="btn btn--accent">Button</button>
                  </div>
                  <code>className="btn btn--accent"</code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <div className="mb-3">
                    <button className="btn btn--accent" disabled>
                      Button
                    </button>
                  </div>
                  <code>className="btn btn--accent" disabled</code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <div className="mb-3">
                    <button
                      type="button"
                      className="btn--nav"
                      aria-label="Previous"
                    >
                      <SvgIcon name="caret-left" />
                    </button>
                  </div>
                  <code>
                    &lt;button type="button" className='btn--nav'
                    aria-label="Previous"&gt; &lt;SvgIcon name="caret-left"/&gt;
                    &lt;/button&gt;
                  </code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <div className="mb-3">
                    <button
                      type="button"
                      className="btn--nav"
                      aria-label="Next"
                    >
                      <SvgIcon name="caret-right" />
                    </button>
                  </div>
                  <code>
                    &lt;button type="button" className='btn--nav'
                    aria-label="Next"&gt; &lt;SvgIcon name="caret"/&gt;
                    &lt;/button&gt;
                  </code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <div className="mb-3">
                    <button type="button" className="btn--nav" disabled>
                      <SvgIcon className="icon-caret" name="caret-right" />
                    </button>
                  </div>
                  <code>
                    &lt;button type="button" className='btn--nav' disabled&gt;
                    &lt;SvgIcon className="icon-caret" name="caret"/&gt;
                    &lt;/button&gt;
                  </code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <div className="mb-3">
                    <button
                      type="button"
                      aria-label="Details"
                      className="btn--secondary btn--details"
                    >
                      Details <SvgIcon name="caret-right" width={10} />
                    </button>
                  </div>
                  <code>
                    &lt;button type="button" aria-label="Details"
                    className='btn--secondary btn--details'&gt; Details
                    &lt;SvgIcon name="caret-right"/&gt; &lt;/button&gt;
                  </code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <div className="mb-3">
                    <button
                      type="button"
                      className="btn--secondary btn--credit"
                    >
                      <SvgIcon
                        className="icon-credits"
                        aria-label="75 Credit Options"
                        name="credits"
                      />{' '}
                      75 Credit Options{' '}
                      <SvgIcon className="icon-plus" name="plus" />
                    </button>
                  </div>
                  <code>
                    &lt;button type="button" aria-label="75 Credit Options"
                    className='btn--secondary btn--credit'&gt; &lt;SvgIcon
                    className="icon-credits" name="credits"/&gt; 75 Credit
                    Options &lt;SvgIcon name="plus"/&gt; &lt;/button&gt;
                  </code>
                </div>
              </div>
            </div>

            <hr />

            <div className="my-10">
              <h3 className="mb-5">Input Fields</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Regular Input Field</h4>
                  <div className="mb-3">
                    <label htmlFor="regularInput" className="sr-only">
                      Enter Email
                    </label>
                    <input
                      id="regularInput"
                      type="email"
                      className="input--regular"
                      placeholder="Enter Email"
                    />
                  </div>
                  <code>
                    &lt;label for="regularInput" className='sr-only'&gt;Enter
                    Email&lt;/label&gt;
                    <br />
                    &lt;input id="regularInput" type="email"
                    className='input--regular' placeholder='Enter Email' /&gt;
                  </code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Input Field w/ Label</h4>
                  <div className="mb-3">
                    <div className="form--floating-label-wrapper">
                      <label htmlFor="testing" className="form--floating-label">
                        Enter Email
                      </label>
                      <input
                        id="testing"
                        type="email"
                        className="form--floating-label-input"
                        placeholder="Enter Email"
                      />
                    </div>
                  </div>
                  <code>
                    &lt;div className='form--floating-label-wrapper'&gt;
                    <br />
                    &lt;label for="testing"
                    className='form--floating-label'&gt;Enter
                    Email&lt;/label&gt;
                    <br />
                    &lt;input id="testing" type="email"
                    className='form--floating-label-input' placeholder='Enter
                    Email' /&gt;
                    <br />
                    &lt;/div&gt;
                  </code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">
                    Regular Input Field w/ a Dark Wrapper
                  </h4>
                  <div className="mb-3">
                    <div className="form-field--dark p-20">
                      <label htmlFor="regularInputDark" className="sr-only">
                        Enter Email
                      </label>
                      <input
                        id="regularInputDark"
                        type="email"
                        className="input--regular"
                        placeholder="Enter Email"
                      />
                    </div>
                  </div>
                  <code>
                    &lt;div className='form-field--dark'&gt;
                    <br />
                    &lt;label for="regularInputDark"
                    className='sr-only'&gt;Enter Email&lt;/label&gt;
                    <br />
                    &lt;input id="regularInputDark" type="email"
                    className='input--regular' placeholder='Enter Email' /&gt;
                    <br />
                    &lt;/div&gt;
                  </code>
                </div>
              </div>
            </div>

            <hr />

            <div className="my-10">
              <h3 className="mb-5">Sort Select Dropdowns</h3>
              <p className="mb-3">Include SelectDropdown.jsx</p>
              <code>
                import SelectDropdown from '@/components/SelectDropdown';
              </code>
              <br />
              <br />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Sort Dropdown</h4>

                  <div className="mb-3">
                    <SelectDropdown
                      id="sorting-checkbox-toggle"
                      type="sort"
                      defaultOptionIndex={0}
                      options={[
                        'Featured',
                        'Newest',
                        'Most Popular',
                        'Price Low to High',
                        'Price High to Low'
                      ]}
                      namespace="testingSorting"
                    ></SelectDropdown>
                  </div>
                  <code>
                    &lt;SelectDropdown id="sorting-checkbox-toggle" type="sort"
                    defaultOptionIndex=&#123;0&#125; options=&#123;['Featured',
                    'Newest', 'Most Popular', 'Price Low to High', 'Price High
                    to Low']&#125;
                    namespace="testingSorting"&gt;&lt;/SelectDropdown&gt;
                  </code>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4 className="mb-3">Select Dropdown</h4>

                  <div className="mb-3">
                    <SelectDropdown
                      id="select-checkbox-toggle"
                      type="select"
                      defaultOptionIndex={0}
                      options={[
                        'New York',
                        'New Jersey',
                        'Connecticut',
                        'Pennsylvania'
                      ]}
                      namespace="testingOption"
                    ></SelectDropdown>
                  </div>
                  <code>
                    &lt;SelectDropdown id="select-checkbox-toggle" type="select"
                    defaultOptionIndex=&#123;0&#125; options=&#123;['New York',
                    'New Jersey', 'Connecticut', 'Pennsylvania']&#125;
                    namespace="testingOption"&gt;&lt;/SelectDropdown&gt;
                  </code>
                </div>
              </div>
            </div>

            <hr />

            <div className="my-10">
              <h3 className="mb-5">Tags</h3>
              <p>Make sure you include thise in jsx files:</p>
              <div className="my-5">
                <code>import Badge from '@/components/Badge';</code>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <div className="mb-3">
                    <Badge color="grey">
                      Content Category / State Specific Tag
                    </Badge>
                  </div>
                  <code>
                    &lt;Badge color="grey"&gt;Content Category / State Specific
                    Tag&lt;/Badge&gt;
                  </code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <div className="mb-3">
                    <Badge color="blue">Best Seller</Badge>
                  </div>
                  <code>
                    &lt;Badge color="blue"&gt;Best Seller&lt;/Badge&gt;
                  </code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <div className="mb-3">
                    <Badge color="red">New!</Badge>
                  </div>
                  <code>&lt;Badge color="red"&gt;New!&lt;/Badge&gt;</code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <div className="mb-3">
                    <Badge color="purple">Bundle</Badge>
                  </div>
                  <code>&lt;Badge color="purple"&gt;Bundle&lt;/Badge&gt;</code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <div className="mb-3">
                    <Badge color="yellow" icon="bolt">
                      FastTrack
                    </Badge>
                  </div>
                  <code>
                    &lt;Badge color="yellow" icon="bolt"&gt;Bundle&lt;/Badge&gt;
                  </code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <div className="mb-3">
                    <Badge color="dark-blue" icon="full-sun">
                      eLearning
                    </Badge>
                  </div>
                  <code>
                    &lt;Badge color="dark-blue"
                    icon="full-sun"&gt;Bundle&lt;/Badge&gt;
                  </code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <div className="mb-3">
                    <Badge color="green">Live Online Seminar</Badge>
                  </div>
                  <code>
                    &lt;Badge color="green"&gt;Live Online Seminar&lt;/Badge&gt;
                  </code>
                </div>
              </div>
            </div>

            <hr />

            <div className="my-10">
              <h3 className="mb-5">Checkbox & Radio Buttons</h3>
              <p>Make sure you include these jsx files:</p>
              <div className="my-5">
                <code>
                  import ToggleButton from '@/components/ToggleButton';
                  <br />
                  import Checkbox from '@/components/Checkbox';
                  <br />
                  import RadioButton from '@/components/RadioButton';
                </code>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4>Toggle</h4>
                  <div className="mb-3">
                    <ToggleButton
                      id="switch"
                      isChecked={false}
                      isDisabled={false}
                      label="Toggle"
                    ></ToggleButton>
                  </div>
                  <code>
                    &lt;ToggleButton id="switch" isChecked=&#123;false&#125;
                    isDisabled=&#123;false&#125;
                    label="Toggle"&gt;&lt;/ToggleButton&gt;
                  </code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4>Toggle Disabled</h4>
                  <div className="mb-3">
                    <ToggleButton
                      id="disabled-switch"
                      isChecked={false}
                      isDisabled={true}
                      label="Toggle"
                    ></ToggleButton>
                  </div>
                  <code>
                    &lt;ToggleButton id="disabled-switch"
                    isChecked=&#123;false&#125; isDisabled=&#123;true&#125;
                    label="Toggle"&gt;&lt;/ToggleButton&gt;
                  </code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4>Checkbox</h4>
                  <div className="mb-3">
                    <Checkbox
                      id="testCheckbox"
                      isChecked={checked}
                      isDisabled={false}
                      onChange={() => setChecked(!checked)}
                      namespace="test_checkbox"
                      label="Label"
                    ></Checkbox>
                  </div>
                  <code>
                    &lt;Checkbox id="testCheckbox" isChecked=&#123;false&#125;
                    isDisabled=&#123;false&#125; namespace="test_checkbox"
                    label="Label"&gt;&lt;/Checkbox&gt;
                  </code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4>Checkbox Disabled</h4>
                  <div className="mb-3">
                    <Checkbox
                      id="testCheckboxDisabled"
                      isChecked={false}
                      isDisabled={true}
                      namespace="test_checkbox_disabled"
                      label="Label"
                    ></Checkbox>
                  </div>
                  <code>
                    &lt;Checkbox id="testCheckboxDisabled"
                    isChecked=&#123;false&#125;
                    isDisabled=&#123;true&#125;namespace="test_checkbox_disabled"
                    label="Label"&gt;&lt;/Checkbox&gt;
                  </code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4>Radio</h4>
                  <div className="mb-3">
                    <RadioButton
                      id="testRadio"
                      isChecked={false}
                      isDisabled={false}
                      namespace="test_radio"
                      label="Label"
                    ></RadioButton>
                  </div>
                  <code>
                    &lt;RadioButton id="testRadio" isChecked=&#123;false&#125;
                    isDisabled=&#123;false&#125; namespace="test_radio"
                    label="Label"&gt;&lt;/RadioButton&gt;
                  </code>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                  <h4>Radio Disabled</h4>
                  <div className="mb-3">
                    <RadioButton
                      id="testRadioDisabled"
                      isChecked={false}
                      isDisabled={true}
                      namespace="test_radio_disabled"
                      label="Label"
                    ></RadioButton>
                  </div>
                  <code>
                    &lt;RadioButton id="testRadioDisabled"
                    isChecked=&#123;false&#125; isDisabled=&#123;true&#125;
                    namespace="test_radio_disabled"
                    label="Label"&gt;&lt;/RadioButton&gt;
                  </code>
                </div>
              </div>
            </div>
          </section>
          <hr />
          <section id="icons" className="my-10">
            <h2>Icons</h2>
            <p className="mb-2">Make sure to include the SvgIcon.jsx file:</p>
            <code>import SvgIcon from '@/components/SvgIcon'</code>
            <br />
            <br />
            <ul className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon name="caret-up" />
                <br />
                <p>Caret Up</p>
                <br />
                <code>&lt;SvgIcon name="caret-up"/&gt;</code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon name="caret-down" />
                <br />
                <p>Caret Down</p>
                <br />
                <code>&lt;SvgIcon name="caret-down"/&gt;</code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon name="caret-left" />
                <br />
                <p>Caret Left</p>
                <br />
                <code>&lt;SvgIcon name="caret-left"/&gt;</code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon name="caret-right" />
                <br />
                <p>Caret Right</p>
                <br />
                <code>&lt;SvgIcon name="caret-right"/&gt;</code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-account" name="account" />
                <br />
                <p>Account</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-account" name="account"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-cart" name="cart" />
                <br />
                <p>Cart</p>
                <br />
                <code>&lt;SvgIcon className="icon-cart" name="cart"/&gt;</code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-search" name="search" />
                <br />
                <p>Search</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-search" name="search"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-menu" name="menu" />
                <br />
                <p>Menu</p>
                <br />
                <code>&lt;SvgIcon className="icon-menu" name="menu"/&gt;</code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-close" name="close" />
                <br />
                <p>Close</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-close" name="close"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-bookmark" name="bookmark" />
                <br />
                <p>Bookmark</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-bookmark" name="bookmark"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-share" name="share" />
                <br />
                <p>Share</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-share" name="share"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-plus" name="plus" />
                <br />
                <p>Plus</p>
                <br />
                <code>&lt;SvgIcon className="icon-plus" name="plus"/&gt;</code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-minus" name="minus" />
                <br />
                <p>Minus</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-minus" name="minus"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-filter" name="filter" />
                <br />
                <p>Filter</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-filter" name="filter"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-email" name="email" />
                <br />
                <p>Email</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-email" name="email"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-link" name="link" />
                <br />
                <p>Link</p>
                <br />
                <code>&lt;SvgIcon className="icon-link" name="link"/&gt;</code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-lock" name="lock" />
                <br />
                <p>Lock</p>
                <br />
                <code>&lt;SvgIcon className="icon-lock" name="lock"/&gt;</code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-time" name="time" />
                <br />
                <p>Time</p>
                <br />
                <code>&lt;SvgIcon className="icon-time" name="time"/&gt;</code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-platform" name="platform" />
                <br />
                <p>Platform</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-platform" name="platform"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-credits" name="credits" />
                <br />
                <p>Credits</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-credits" name="credits"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-calendar" name="calendar" />
                <br />
                <p>Calendar</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-calendar" name="calendar"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-location" name="location" />
                <br />
                <p>Location</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-location" name="location"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-arrow" name="arrow" />
                <br />
                <p>Arrow Left</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-arrow" name="arrow"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-arrow rotate-180" name="arrow" />
                <br />
                <p>Arrow Right</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-arrow rotate-180"
                  name="arrow"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-check" name="check" />
                <br />
                <p>Check</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-check" name="check"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-bolt" name="bolt" strokeWidth={2} />
                <br />
                <p>Bolt</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-bolt" name="bolt"
                  strokeWidth=&#123;2&#125; /&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-post-apply" name="post-apply" />
                <br />
                <p>Upon Request</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-post-apply" name="post-apply"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-reciprocity" name="reciprocity" />
                <br />
                <p>Reciprocity</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-reciprocity"
                  name="reciprocity"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-pending" name="pending" />
                <br />
                <p>Pending</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-pending" name="pending"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-alert" name="alert" />
                <br />
                <p>Alert</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-alert" name="alert"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-alert" name="alert-2" />
                <br />
                <p>Alert</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-alert" name="alert-2"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-edit-view-off" name="edit-view-off" />
                <br />
                <p>Edit View Off</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-edit-view-off"
                  name="edit-view-off"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-edit-view-on" name="edit-view-on" />
                <br />
                <p>Edit View On</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-edit-view-on"
                  name="edit-view-on"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon
                  className="icon-star icon-star-fill"
                  name="star-fill"
                />
                <br />
                <p>Star Fill</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-star icon-star-fill"
                  name="star-fill"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon
                  className="icon-star icon-star-half"
                  name="star-half"
                />
                <br />
                <p>Star Half</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-star icon-star-fill"
                  name="star-half"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon
                  className="icon-star icon-star-empty"
                  name="star-empty"
                />
                <br />
                <p>Star Empty</p>
                <br />
                <code>
                  &lt;SvgIcon className="icon-star icon-star-fill"
                  name="star-empty"/&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-facebook" name="facebook"></SvgIcon>
                <br />
                <p>Facebook</p>
                <br />
                <code>
                  &lt;SvgIcon className=&quot;icon-facebook&quot;
                  name=&quot;facebook&quot;&gt;&lt;/SvgIcon&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-linkedin" name="linkedin"></SvgIcon>
                <br />
                <p>Linkedin</p>
                <br />
                <code>
                  &lt;SvgIcon className=&quot;icon-linkedin&quot;
                  name=&quot;linkedin&quot;&gt;&lt;/SvgIcon&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon className="icon-twitter" name="twitter"></SvgIcon>
                <br />
                <p>Twitter</p>
                <br />
                <code>
                  &lt;SvgIcon className=&quot;icon-twitter&quot;
                  name=&quot;twitter&quot;&gt;&lt;/SvgIcon&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon
                  width={15}
                  height={15}
                  strokeWidth={2}
                  name="full-sun"
                />
                <br />
                <p>Full Sun</p>
                <br />
                <code>
                  &lt;SvgIcon width=&#123;15&#125; height=&#123;15&#125;
                  strokeWidth=&#123;2&#125; name=&quot;full-sun&quot; /&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon
                  width={15}
                  height={15}
                  strokeWidth={2}
                  name="half-sun"
                />
                <br />
                <p>Half Sun</p>
                <br />
                <code>
                  &lt;SvgIcon width=&#123;15&#125; height=&#123;15&#125;
                  strokeWidth=&#123;2&#125; name=&quot;half-sun&quot; /&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <SvgIcon width={25} height={26} name="phone" />
                <br />
                <p>Phone</p>
                <br />
                <code>
                  &lt;SvgIcon width=&#123;25&#125; height=&#123;26&#125;
                  name=&quot;phone&quot; /&gt;
                </code>
              </li>
            </ul>
          </section>
          <hr />
          <section id="profile-badge" className="my-10">
            <h2>Profile Badge</h2>
            <ul className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <span className="profile__badge h-[50px] w-[50px] text-h4-mobile lg:text-h4">
                  DF
                </span>
                <br />
                <code>
                  &lt;span className="profile__badge w-[50px] h-[50px]
                  lg:text-h4 text-h4-mobile"&gt; DF &lt;/span&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <span className="profile__badge h-20 w-20 text-h3-mobile md:h-[100px] md:w-[100px] lg:text-h3">
                  DF
                </span>
                <br />
                <code>
                  &lt;span className="profile__badge w-20 h-20 md:w-[100px]
                  md:h-[100px] lg:text-h3 text-h3-mobile"&gt; DF &lt;/span&gt;
                </code>
              </li>
              <li className="flex flex-col items-center rounded-xl border border-slate-200 p-5">
                <span className="profile__badge mb-8 h-20 w-20 text-h2-mobile lg:h-40 lg:w-40 lg:text-h2">
                  DF
                </span>
                <br />
                <code>
                  &lt;span className="profile__badge w-20 h-20 lg:w-40 lg:h-40
                  mb-8 lg:text-h2 text-h2-mobile"&gt; DF &lt;/span&gt;
                </code>
              </li>
            </ul>
          </section>
          <hr />
          <section id="shimmer" className="my-10">
            <h2>Shimmer Course Card</h2>
            <div className="collection gx-[0px] container-fluid max-w-full py-10">
              <div className="row">
                <div className="flex w-full snap-x flex-row gap-6 overflow-x-auto py-14">
                  <CourseCardShimmer
                    className={`w-[18.125rem] flex-shrink-0`}
                    display_vertical={true}
                    size={15}
                  />
                </div>
              </div>
            </div>
            <div className="collection container-fluid gx-sm max-w-screen-xl py-10 xl:gx-xl">
              <div className="row">
                <div className="col-12 lg:col-3"></div>
                <div className="col-12 lg:col-9">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-1">
                    <CourseCardShimmer />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
export function Component() {
  return <UIGuide />;
}

Component.displayName = 'UIGuide';

export default UIGuide;
