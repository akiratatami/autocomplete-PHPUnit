var PHPUnitAssertionsProvider = require('./phpunit-assertions');

/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 * @type {Object}
 */
module.exports = {
    /**
     * @type {null|Object}
     */
    provider: null,

    /**
     * @type {null|Object}
     */
    autocomplete: null,

    /**
     * @type {null|Object}
     */
    editorSubscription: null,

    /**
     * @return {void}
     */
    activate: function() {
        atom.packages.activatePackage('autocomplete-plus').then(function (pkg) {
            this.autocomplete = pkg.mainModule;
            this._registerProvider();
        }.bind(this));
    },

    /**
     * @private
     * @return {void}
     */
    _registerProvider: function() {
        this.editorSubscription = atom.workspaceView.eachEditorView(function (editorView) {
            if (editorView.attached && !editorView.mini) {
                this.provider = new PHPUnitAssertionsProvider(editorView);

                this.autocomplete.registerProviderForEditorView(
                    this.provider,
                    editorView
                );
            }
        }.bind(this));
    },

    /**
     * @return {void}
     */
    deactivate: function() {
        if (this.editorSubscription) {
            this.editorSubscription.off();
            this.editorSubscription = null;
        }

        if (this.autocomplete) {
            this.autocomplete.unregisterProvider(this.provider);
            this.provider = null;
        }
    }
};
