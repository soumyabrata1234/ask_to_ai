import projectModel from '../models/projectmodel.js';

import userModel from '../models/user.model.js';



export const createProject = async (req, res) => {

    try {

        const { name } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        const userId = loggedInUser._id;

        const project = await projectModel.create({
            name,
            users: [ userId ]
        })
        res.status(200).json({project});
        

    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }



}

export const getAllProject = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUserProjects = await projectModel.find({
            users: {
                $in: [ loggedInUser._id ]
            }
        }).populate('users', 'name email')

        return res.status(200).json({
            projects: allUserProjects
        })

    } catch (err) {
        console.log(err)
        res.status(404).json({ error: err.message })
    }
}

export const addUserToProject = async (req, res) => {
   

    try {

       const { name, users } = req.body

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })


    // Filter out user IDs that are already in the project's users array
    const project = await projectModel.findOne({ name: name });
    if (!project) {
        throw new Error('Project not found');
    }

    // Only add user IDs that are not already present
    const newUsers = users.filter(
        userId => !project.users.map(id => id.toString()).includes(userId.toString())
    );

    let updatedProject = project;
    if (newUsers.length > 0) {
        updatedProject = await projectModel.findOneAndUpdate(
            { name: name },
            { $addToSet: { users: { $each: newUsers } } },
            { new: true }
        );
    }
    console.log(updatedProject);
    res.status(200).json({
        project: updatedProject
    })
      


    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }


}

export const getProjectById = async (req, res) => {

    const { projectId } = req.params;

    try {

        const project = await projectService.getProjectById({ projectId });

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}

export const updateFileTree = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, fileTree } = req.body;

        const project = await projectService.updateFileTree({
            projectId,
            fileTree
        })

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}

export const getallusers = async (req, res) => {
    const { projectname } = req.params;

    try {
        const project = await projectModel.findOne({ name: projectname }).populate('users', 'name email');
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        console.log(req.user.email);
        return res.status(200).json({
            users: project.users,
            email: req.user.email
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}