import { html, render, useEffect } from '../../deps/htm-preact.js';
import InputLocales from './input-locale/view.js';
import InputUrls from './input-urls/view.js';
import { currentStep, fetchLocaleDetails } from './store.js';
import StepTracker from './components/stepTracker.js';
import InputActions from './input-actions/view.js';
import Header from '../milostudio-header/milostudio-header.js';
import Sidenav from '../milostudio-sidenav/sidenav.js';
import { getConfig, loadStyle } from '../../utils/utils.js';
import login from '../../tools/sharepoint/login.js';

async function loginToSharePoint() {
  const scopes = ['files.readwrite', 'sites.readwrite.all'];
  await login({ scopes, telemetry: { application: { appName: 'Adobe Localization' } } });
}
function Create() {
  useEffect(() => {
    const fetchLocaleDetailsAsync = async () => {
      try {
        await fetchLocaleDetails();
        await loginToSharePoint();
      } catch (error) {
        // console.error('Error fetching locale details:', error);
      }
    };

    fetchLocaleDetailsAsync();
  }, []);

  return html`
    <div class="locui-create-container">
      <div class="header">
        <${Header} />
      </div> 
      <div class="side-nav">
        <${Sidenav} />
      </div>
      <div class="main-content">
        <h3>Create New Project</h3>
        <${StepTracker} />
        ${currentStep.value === 1 && html`<${InputUrls} />`}
        ${currentStep.value === 2 && html`<${InputLocales} />`}
        ${currentStep.value === 3 && html`<${InputActions} />`}
      </div>
    </div>
  `;
}

export default function init(el) {
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  loadStyle(`${base}/blocks/milostudio-header/milostudio-header.css`);
  render(html`<${Create} />`, el);
}
