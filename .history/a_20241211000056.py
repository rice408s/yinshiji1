Traceback (most recent call last):
  File "C:\Users\rice408\code\yinshiji\a.py", line 1, in <module>
    import cairosvg
  File "C:\Users\rice408\AppData\Local\Programs\Python\Python312\Lib\site-packages\cairosvg\__init__.py", line 26, in <module>
    from . import surface  # noqa isort:skip
    ^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\rice408\AppData\Local\Programs\Python\Python312\Lib\site-packages\cairosvg\surface.py", line 9, in <module>
    import cairocffi as cairo
  File "C:\Users\rice408\AppData\Local\Programs\Python\Python312\Lib\site-packages\cairocffi\__init__.py", line 60, in <module>
    cairo = dlopen(
            ^^^^^^^
  File "C:\Users\rice408\AppData\Local\Programs\Python\Python312\Lib\site-packages\cairocffi\__init__.py", line 57, in dlopen
    raise OSError(error_message)  # pragma: no cover
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
OSError: no library called "cairo-2" was found
no library called "cairo" was found
no library called "libcairo-2" was found
cannot load library 'libcairo.so.2': error 0x7e.  Additionally, ctypes.util.find_library() did not manage to locate a library called 'libcairo.so.2'
cannot load library 'libcairo.2.dylib': error 0x7e.  Additionally, ctypes.util.find_library() did not manage to locate a library called 'libcairo.2.dylib'
cannot load library 'libcairo-2.dll': error 0x7e.  Additionally, ctypes.util.find_library() did not manage to locate a library called 'libcairo-2.dll'
PS C:\Users\rice408\code\yinshiji> 
