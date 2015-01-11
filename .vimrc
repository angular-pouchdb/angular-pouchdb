setlocal wildignore+=dist,*/test/coverage
setlocal foldlevelstart=2
let g:syntastic_javascript_checkers = ['eslint']
let g:used_javascript_libs = 'angularjs'
let $PATH = './node_modules/.bin:' . $PATH
