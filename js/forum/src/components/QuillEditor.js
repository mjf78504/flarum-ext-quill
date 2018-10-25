import Component from 'flarum/Component';
import Button from 'flarum/components/Button';
import ItemList from 'flarum/utils/ItemList';
import listItems from 'flarum/helpers/listItems';

/**
 * The `QuillEditor` component displays a WYSIWYG textarea
 *
 * ### Props
 *
 * - `submitLabel`
 * - `value`
 * - `placeholder`
 * - `disabled`
 */
export default class QuillEditor extends Component {

    init() {
        this.value = m.prop(this.props.value || '');

        // provide default class name
        this.props.className = this.props.className || "sledov-quill-editor";

        // editor instance to be initialized later
        this.quill = null;

    }

    view() {
        const classNames = 'Composer-flexible ' + this.props.className;
        return (
            <div className="TextEditor">
                <div className={classNames} config={this.configEditor.bind(this)} />
                <ul className="TextEditor-controls Composer-footer">
                    {listItems(this.controlItems().toArray())}
                </ul>
            </div>
        )
    }

    configEditor(element, isInitialized) {

        if (isInitialized) return;

        this.quill = new Quill('.' + this.props.className, {
            modules: {
                toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block']
    ]
            },
            placeholder: this.props.placeholder || '',
            readOnly: !!this.props.disabled,
            theme: 'snow'
        });
        
        
        
      /**
       * Step1. select local image
       *
       */
    function selectLocalImage() {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.click();

      // Listen upload local image and save to server
      input.onchange = () => {
        const file = input.files[0];

        // file type is only image.
        if (/^image\//.test(file.type)) {
          saveToServer(file);
        } else {
          console.warn('You could only upload images.');
        }
      };
    }

    /**
     * Step2. save to server
     *
     * @param {File} file
     */
    function saveToServer(file: File) {
      const fd = new FormData();
      fd.append('image', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:3000/upload/image', true);
      xhr.onload = () => {
        if (xhr.status === 200) {
          // this is callback data: url
          const url = JSON.parse(xhr.responseText).data;
          insertToEditor(url);
        }
      };
      xhr.send(fd);
    }

    /**
     * Step3. insert image url to rich editor.
     *
     * @param {string} url
     */
    function insertToEditor(url: string) {
      // push image url to rich editor.
      const range = editor.getSelection();
      editor.insertEmbed(range.index, 'image', 'http://localhost:9000${url}');
    }

    // quill editor add image handler
     this.quill.getModule('toolbar').addHandler('image', () => {
      selectLocalImage();
    });

        this.quill.clipboard.dangerouslyPasteHTML(0, this.value());
        this.quill.on('text-change', this.oninput.bind(this));

    }

    /**
     * Build an item list for the text editor controls.
     *
     * @return {ItemList}
     */
    controlItems() {
        const items = new ItemList();

        items.add('submit',
            Button.component({
                children: this.props.submitLabel,
                icon: 'check',
                className: 'Button Button--primary',
                itemClassName: 'App-primaryControl',
                onclick: this.onsubmit.bind(this)
            })
        );

        if (this.props.preview) {
            items.add('preview',
                Button.component({
                    icon: 'eye',
                    className: 'Button Button--icon',
                    onclick: this.props.preview
                })
            );
        }

        return items;
    }

    /**
     * Handle input into the editor.
     */
    oninput() {
        let html = this.quill.root.innerHTML;
        this.value(html);
        this.props.onchange(html);
        m.redraw.strategy('none');
    }

    /**
     * Handle the submit button being clicked.
     */
    onsubmit() {
        this.props.onsubmit(this.value());
    }
}
