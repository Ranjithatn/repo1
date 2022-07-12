import os
import shutil

with open("FilesToRemoveForPortableDeployment.txt") as f:
    fileNames = f.readlines()
    folderPath = 'c:\\projects\\ucwclient\\release\\win-ia32-unpacked\\'
    for x in fileNames:
        fileToRemove = folderPath + x.strip()           
        if os.path.exists(fileToRemove):
            if os.path.isfile(fileToRemove):
                os.remove(fileToRemove)
            elif os.path.isdir(fileToRemove):
                shutil.rmtree(fileToRemove)
        #else:
        #    print(fileToRemove, " not found")
