/* global CustomEvent */

class State extends EventTarget {
  constructor ({ coverageNetworkEnabled, dataValue, shapeValue, validationSettings }) {
    super()

    this.coverage = null
    this.coverageNetworkEnabled = coverageNetworkEnabled
    this.data = null
    this.dataValue = dataValue
    this.report = null
    this.shape = null
    this.shapeValue = shapeValue
    this.validationSettings = validationSettings
  }

  coverageChange (coverage, compounds, compoundLabels) {
    this.compoundLabels = compoundLabels
    this.compounds = compounds
    this.coverage = coverage

    this.dispatchEvent(new CustomEvent('coverageChange', {
      detail: {
        compoundLabels: this.compoundLabels,
        compounds: this.compounds,
        coverage: this.coverage
      }
    }))
  }

  dataChange (data, dataValue) {
    this.data = data
    this.dataValue = dataValue

    this.dispatchEvent(new CustomEvent('dataDatasetChange', {
      detail: {
        dataset: this.data
      }
    }))

    this.dispatchEvent(new CustomEvent('dataValueChange', {
      detail: {
        value: this.dataValue
      }
    }))
  }

  coverageNetworkChange (enabled) {
    this.coverageNetworkEnabled = enabled

    this.dispatchEvent(new CustomEvent('coverageNetworkEnabledChange', {
      detail: {
        enabled: this.coverageNetworkEnabled
      }
    }))
  }

  shapeChange (shape, shapeValue) {
    this.shape = shape
    this.shapeValue = shapeValue

    this.dispatchEvent(new CustomEvent('shapeDatasetChange', {
      detail: {
        dataset: this.shape
      }
    }))

    this.dispatchEvent(new CustomEvent('shapeValueChange', {
      detail: {
        value: this.shapeValue
      }
    }))
  }

  reportChange (report) {
    this.report = report

    this.dispatchEvent(new CustomEvent('reportChange', {
      detail: {
        report: this.report
      }
    }))
  }

  validationSettingsChange (validationSettings) {
    this.validationSettings = validationSettings

    this.dispatchEvent(new CustomEvent('validationSettingsChange', {
      detail: {
        ...validationSettings
      }
    }))
  }
}

export default State
