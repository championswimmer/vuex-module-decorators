# CHANGELOG

## 1.0.0

### 0.8.0
##### 0.8.0-1
 - in `@Action` functions -
    - `this.stateField` works pointing to fields in the module's state
    - `this.commit()` is the context.commit function

##### 0.8.0-0
 - allow `getModule()` even for non-dynamic modules

    > **NOTE:** From now on you have to use`getModule(ModuleClass)`  
    > instead of the earlier `getModule(ModuleClass.prototype)`
 - update to prettier code formatting

#### 0.7.1

 - fix `unable to construct without new` error for transpiled ES5

### 0.7.0
 - add `module` field to package.json for ES6 module loaders
    - tree-shaking supported
### 0.6.0
 - distribute cjs, esm and minified cdn package separately
### 0.1.0

#### 0.0.1