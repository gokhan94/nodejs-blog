tinymce.init({
    selector: 'textarea#textareaEditor',
    menubar: false,
    statusbar: false,
    init_instance_callback: function(ed){
        ed.on('keyup', function (e) { 
            document.getElementById("textareaEditor").innerHTML += e.key;
        });
    },
    height:400,
    width:800,
    plugins: 'code',
    codesample_global_prismjs: true,
    entity_encoding : "raw",
    entities: '20,>,<,<,160,nbsp,162,cent,8364,euro,163,pound',
    element_format : 'html',
    forced_root_block : 'p',
    schema: 'html5',
    cleanup : true,
    codesample_languages: [
        {text: 'HTML/XML', value: 'markup'},
        {text:"HTML",value:"html"},
        {text: 'JavaScript', value: 'javascript'},
        {text: 'CSS', value: 'css'},
        {text: 'PHP', value: 'php'},
        {text: 'Ruby', value: 'ruby'},
        {text: 'Python', value: 'python'},
        {text: 'Java', value: 'java'},
        {text: 'C', value: 'c'},
        {text: 'C#', value: 'csharp'},
        {text: 'C++', value: 'cpp'}
      ],
    toolbar: 'code' + 'undo redo | casechange blocks | bold italic | ' +
        'alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist checklist outdent indent | removeformat | a11ycheck code table'
    
});