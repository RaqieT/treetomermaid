let BRANCH_NAME_INDEX = 4;

function minButNotMinusOne(first, second, defaultValue) {
    if (first === -1) {
        if (second === -1) {
            return defaultValue;
        }

        return second;
    }

    if (second === -1) {
        return first;
    }

    if (first < second) {
        return first;
    }

    return second;
};

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

class Branch {

    constructor(name, treeResult) {
        this.branches = [];
        this.name = name;
        this.id = uuidv4();
        let startTreeSign = "├";
        let startTreeSignSecondOne = "└";
        let tree = treeResult + "";

        let startTreeIndex = tree.indexOf(startTreeSign);
        let startTreeIndexTwo = tree.indexOf(startTreeSignSecondOne);

        tree = tree.substring(minButNotMinusOne(startTreeIndex, startTreeIndexTwo));
        this.treePart = tree;
    }

    loadBranches() {
        let allBranches = [this];
        var lines = this.treePart.split('\n');
        if (lines[lines.length - 1] === "") {
            lines.pop();
        }
        lines.forEach((line, index) => {
            if (this.doesLineNotStartWithNewDirectoryChar(lines, index)) {
                return; // skip inner lines
            }

            let newName = line.substring(BRANCH_NAME_INDEX, line.length);
            let counter = index + 1;
            let newTreePart = "";
            while (lines[counter] && this.doesLineNotStartWithNewDirectoryChar(lines, counter) && counter < lines.length) {
                newTreePart += lines[counter].substring(BRANCH_NAME_INDEX) + '\n';
                counter += 1;
            }
            
            let newBranch = new Branch(newName, newTreePart);
            newBranch.loadBranches().forEach(el => allBranches.push(el));
            this.branches.push(newBranch);
        });
        return allBranches;
    }

    doesLineNotStartWithNewDirectoryChar(lines, index) {
        return lines[index].indexOf('└') !== 0 && lines[index].indexOf('├') !== 0
    }

}

export default Branch;
